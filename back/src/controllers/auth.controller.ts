import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { sendEmail } from "../util/email";

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const MAX_FAILED_ATTEMPTS = 5; // Maximum allowed failed login attempts
// Register function with error codes
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
        errorCode: "USERNAME_EXISTS",
      });
    }

    // Generate a unique salt and hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const userId = await UserModel.create(
      username,
      passwordHash,
      email,
      fullName
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        username,
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "An error occurred during registration",
      errorCode: "REGISTRATION_ERROR",
    });
  }
};

// Login function with error codes
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    // Check if the account is inactive
    if (user.account_status === "inactive") {
      return res.status(403).json({
        message: "Account is inactive. Please contact support.",
        errorCode: "ACCOUNT_INACTIVE",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await UserModel.incrementFailedLoginAttempts(user.id);

      // Check if the user has reached the maximum number of failed attempts
      if (user.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
        // Set account status to inactive after 5 failed attempts
        await UserModel.updateAccountStatus(user.id, "inactive");
        return res.status(403).json({
          message:
            "Account is now inactive due to multiple failed login attempts. Please contact support.",
          errorCode: "ACCOUNT_LOCKED",
        });
      }

      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    // Reset failed attempts on successful login
    await UserModel.resetFailedLoginAttempts(user.id);
    await UserModel.updateLastLogin(user.id);

    const verificationCode = generateVerificationCode();
    await UserModel.storeVerificationCode(user.id, verificationCode);

    await sendEmail(
      user.email,
      "Your Login Verification Code",
      `Your verification code is: ${verificationCode}.`
    );

    res.json({
      message: "Verification code sent to your email",
      userId: user.id,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred during login",
      errorCode: "LOGIN_ERROR",
    });
  }
};

// Verify code function with error codes
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const storedCode = await UserModel.getVerificationCode(userId);
    if (!storedCode) {
      return res.status(400).json({
        message: "No verification code found",
        errorCode: "VERIFICATION_CODE_NOT_FOUND",
        verified: false,
      });
    }

    if (code === storedCode) {
      await UserModel.clearVerificationCode(userId);

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        balance: user.balance,
        last_login: user.last_login,
        account_status: user.account_status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.json({
        message: "Verification successful",
        verified: true,
        token,
        user: userData,
      });
    } else {
      res.status(400).json({
        message: "Invalid verification code",
        errorCode: "INVALID_VERIFICATION_CODE",
        verified: false,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      message: "An error occurred during verification",
      errorCode: "VERIFICATION_ERROR",
    });
  }
};

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        errorCode: "INVALID_USER_ID",
      });
    }

    // Check if the requesting user is the same as the requested user
    if (req.user?.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized access",
        errorCode: "UNAUTHORIZED_ACCESS",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      balance: user.balance,
      last_login: user.last_login,
      account_status: user.account_status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.json(userData);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "An error occurred while fetching user data",
      errorCode: "GET_USER_ERROR",
    });
  }
};
