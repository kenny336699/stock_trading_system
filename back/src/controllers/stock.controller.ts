import { Request, Response } from "express";
import { StockModel } from "../models/stock.model";
import { authenticateJWT } from "../middleware/auth.middleware";

interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

// Get all stocks
export const getAllStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await StockModel.findAll();
    return res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({ message: "Error fetching stocks" });
  }
};

// Find stock by symbol
export const findStockBySymbol = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol;
    const stocks = await StockModel.findBySymbol(symbol);
    if (stocks.length === 0) {
      res.status(404).json({ message: "No stocks found matching the symbol" });
    } else {
      res.json(stocks);
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching stocks",
        error: (error as Error).message,
      });
  }
};

export const buyStock = async (req: AuthRequest, res: Response) => {
  const { stockId, quantity } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  if (!stockId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Invalid input",
      errorCode: "INVALID_INPUT",
    });
  }

  try {
    const stock = await StockModel.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
        errorCode: "STOCK_NOT_FOUND",
      });
    }

    await StockModel.buyStock(userId, stockId, quantity, stock.current_price);

    res.status(200).json({
      message: "Stock purchased successfully",
      stockSymbol: stock.symbol,
      quantity: quantity,
      totalCost: stock.current_price * quantity,
    });
  } catch (error) {
    console.error("Buy stock error:", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while buying stock",
      errorCode: "BUY_STOCK_ERROR",
    });
  }
};

export const getUserStocks = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const userStocks = await StockModel.getUserStocks(userId);
    res.status(200).json(userStocks);
  } catch (error) {
    console.error("Get user stocks error:", error);
    res.status(500).json({
      message: "An error occurred while retrieving user stocks",
      errorCode: "GET_USER_STOCKS_ERROR",
    });
  }
};

export const sellStock = async (req: AuthRequest, res: Response) => {
  const { stockId, quantity } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  if (!stockId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Invalid input",
      errorCode: "INVALID_INPUT",
    });
  }

  try {
    const stock = await StockModel.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
        errorCode: "STOCK_NOT_FOUND",
      });
    }

    await StockModel.sellStock(userId, stockId, quantity, stock.current_price);

    res.status(200).json({
      message: "Stock sold successfully",
      stockSymbol: stock.symbol,
      quantity: quantity,
      totalSaleAmount: stock.current_price * quantity,
    });
  } catch (error) {
    console.error("Sell stock error:", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while selling stock",
      errorCode: "SELL_STOCK_ERROR",
    });
  }
};
