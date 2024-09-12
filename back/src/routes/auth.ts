// src/routes/auth.ts

import express from "express";
import {
  getUserById,
  login,
  register,
  verifyCode,
} from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verifyCode); // Add route for verifying the code
router.get("/user/:id", authenticateJWT, getUserById);
export default router;
