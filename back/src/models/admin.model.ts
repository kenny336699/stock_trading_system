// src/models/admin.model.ts

import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
export interface Admin extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export class AdminModel {
  static async findByUsername(username: string): Promise<Admin | null> {
    const [rows] = await pool.query<Admin[]>(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );
    return rows[0] || null;
  }

  static async updateUserStatus(userId: number, status: string): Promise<void> {
    await pool.query("UPDATE users SET account_status = ? WHERE id = ?", [
      status,
      userId,
    ]);
  }
  static async create(username: string, password: string): Promise<number> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      [username, passwordHash]
    );

    return result.insertId;
  }
}
