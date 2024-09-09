// src/routes/auth.ts

import express from "express";
import { login, register, verifyCode } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verifyCode); // Add route for verifying the code

export default router;
