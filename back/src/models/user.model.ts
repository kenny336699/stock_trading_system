import { RowDataPacket } from "mysql2";

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
