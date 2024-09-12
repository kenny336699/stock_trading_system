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
  failedLoginAttempts: number; // Make sure to add this field to the user model interface
}

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

  static async storeVerificationCode(
    userId: number,
    code: string,
    expiresIn: number = 600
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Default to 10 minutes (600 seconds)
    await pool.query(
      "UPDATE users SET mfa_secret = ?, mfa_expires_at = ? WHERE id = ?",
      [code, expiresAt, userId]
    );
  }

  static async getVerificationCode(userId: number): Promise<string | null> {
    const [rows] = await pool.query<User[]>(
      "SELECT mfa_secret FROM users WHERE id = ? AND mfa_expires_at > CURRENT_TIMESTAMP",
      [userId]
    );
    console.log(userId, rows);
    return rows[0]?.mfa_secret || null;
  }

  static async clearVerificationCode(userId: number): Promise<void> {
    await pool.query(
      "UPDATE users SET mfa_secret = NULL, mfa_expires_at = NULL WHERE id = ?",
      [userId]
    );
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  // Add the following methods to manage failed login attempts and account status

  // Increment failed login attempts
  static async incrementFailedLoginAttempts(userId: number): Promise<void> {
    await pool.query(
      "UPDATE users SET failedLoginAttempts = failedLoginAttempts + 1 WHERE id = ?",
      [userId]
    );
  }

  // Reset failed login attempts after successful login
  static async resetFailedLoginAttempts(userId: number): Promise<void> {
    await pool.query("UPDATE users SET failedLoginAttempts = 0 WHERE id = ?", [
      userId,
    ]);
  }

  // Update the account status (active, suspended, or inactive)
  static async updateAccountStatus(
    userId: number,
    status: "active" | "suspended" | "inactive"
  ): Promise<void> {
    await pool.query("UPDATE users SET account_status = ? WHERE id = ?", [
      status,
      userId,
    ]);
  }
  static async fetchAllUsers(): Promise<User[]> {
    const [rows] = await pool.query<User[]>(
      "SELECT id, username, email, full_name, balance, last_login, account_status, created_at, updated_at, failedLoginAttempts FROM users"
    );
    return rows;
  }
}
