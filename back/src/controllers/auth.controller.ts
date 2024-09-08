import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { sendEmail } from "../util/email";
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

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
    res.status(500).json({ message: "An error occurred during registration" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await UserModel.updateLastLogin(user.id);

    const verificationCode = generateVerificationCode();
    await UserModel.storeVerificationCode(user.id, verificationCode);

    const emailSubject = "Your Login Verification Code";
    const emailText = `Your verification code is: ${verificationCode}. This code is valid for your current login session.`;

    await sendEmail(user.email, emailSubject, emailText);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Verification code sent to your email",
      token,
      user: { id: user.id, username: user.username, email: user.email },
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedCode = await UserModel.getVerificationCode(userId);
    if (!storedCode) {
      return res
        .status(400)
        .json({ message: "No verification code found", verified: false });
    }

    if (code === storedCode) {
      await UserModel.clearVerificationCode(userId);
      res.json({ message: "Verification successful", verified: true });
    } else {
      res
        .status(400)
        .json({ message: "Invalid verification code", verified: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "An error occurred during verification" });
  }
};
