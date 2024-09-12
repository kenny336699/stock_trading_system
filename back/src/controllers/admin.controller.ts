// src/controllers/admin.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user.model";
import { AdminModel } from "../models/admin.model";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const admin = await AdminModel.findByUsername(username);
    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      message: "An error occurred during admin login",
      errorCode: "ADMIN_LOGIN_ERROR",
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    await AdminModel.updateUserStatus(userId, status);

    res.json({
      message: "User status updated successfully",
      userId,
      newStatus: status,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      message: "An error occurred while updating user status",
      errorCode: "UPDATE_USER_STATUS_ERROR",
    });
  }
};
// src/controllers/admin.controller.ts

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminModel.findByUsername(username);
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin username already exists",
        errorCode: "ADMIN_USERNAME_EXISTS",
      });
    }

    // Create new admin
    const adminId = await AdminModel.create(username, password);

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: adminId,
        username,
      },
    });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({
      message: "An error occurred while creating the admin",
      errorCode: "ADD_ADMIN_ERROR",
    });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.fetchAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};
