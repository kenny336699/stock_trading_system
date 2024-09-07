// src/utils/jwt.ts
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  username: string;
}

export const verifyToken = (token: string): JwtPayload => {
  // Your implementation here
};
