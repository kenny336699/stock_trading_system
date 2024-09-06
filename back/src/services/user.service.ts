import pool from "../config/db";
import { User } from "../models/user.model";

export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
};

export const updateLastLogin = async (userId: number): Promise<void> => {
  await pool.query(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
    [userId]
  );
};
