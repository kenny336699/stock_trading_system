// src/models/User.ts

import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  full_name: string;
  balance: number;
  mfa_secret: string | null;
  last_login: Date | null;
  account_status: "active" | "suspended" | "inactive";
  created_at: Date;
  updated_at: Date;
}
//
export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0] || null;
  }

  static async create(
    username: string,
    passwordHash: string,
    email: string,
    fullName: string
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, password_hash, email, full_name) VALUES (?, ?, ?, ?)",
      [username, passwordHash, email, fullName]
    );
    return result.insertId;
  }

  static async updateLastLogin(id: number): Promise<void> {
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
  }
}
