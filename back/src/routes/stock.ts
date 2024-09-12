import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import {
  buyStock,
  findStockBySymbol,
  getAllStocks,
  getUserStocks,
  sellStock,
} from "../controllers/stock.controller";

const router = Router();

// Public routes
router.get("/", getAllStocks);
router.get("/:symbol", findStockBySymbol);

// Protected routes
router.post("/buy", authenticateJWT, buyStock);
router.post("/sell", authenticateJWT, sellStock);
router.get("/user/:userId", authenticateJWT, getUserStocks);

export default router;
