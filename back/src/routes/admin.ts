// src/routes/admin.ts

import express from "express";

import { authenticateJWT } from "../middleware/auth.middleware";
import {
  addAdmin,
  adminLogin,
  getAllUsers,
  updateUserStatus,
} from "../controllers/admin.controller";

const router = express.Router();

router.post("/login", adminLogin);
router.put("/user-status", authenticateJWT, updateUserStatus);
router.post("/add", addAdmin); // Removed authenticateJWT middleware
router.get("/getAllUser", getAllUsers);
export default router;
