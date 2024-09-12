import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Define the Stock interface, reflecting the table's columns
export interface Stock extends RowDataPacket {
  id: number;
  symbol: string;
  name: string;
  current_price: number;
  last_updated: Date;
}
export interface UserStock extends RowDataPacket {
  id: number;
  user_id: number;
  stock_id: number;
  symbol: string;
  name: string;
  quantity: number;
  average_buy_price: number;
}

export class StockModel {
  static async findById(id: number): Promise<Stock | null> {
    const [rows] = await pool.query<Stock[]>(
      "SELECT * FROM stocks WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }
  // Find a stock by its symbol
  static async findBySymbol(symbol: string): Promise<Stock[]> {
    console.log("3123", symbol);
    const [rows] = await pool.query<Stock[]>(
      "SELECT * FROM stocks WHERE symbol LIKE ?",
      [`%${symbol}%`]
    );

    return rows;
  }

  // Find all stocks
  static async findAll(): Promise<Stock[]> {
    const [rows] = await pool.query<Stock[]>("SELECT * FROM stocks");
    return rows;
  }
  static async getUserStocks(userId: number): Promise<UserStock[]> {
    const [rows] = await pool.query<UserStock[]>(
      `SELECT us.id, us.user_id, us.stock_id, s.symbol, s.name, us.quantity, us.average_buy_price
       FROM user_stocks us
       JOIN stocks s ON us.stock_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async buyStock(
    userId: number,
    stockId: number,
    quantity: number,
    currentPrice: number
  ): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get user's current balance
      const [userRows] = await connection.query<RowDataPacket[]>(
        "SELECT balance FROM users WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const userBalance = userRows[0].balance;
      const totalCost = currentPrice * quantity;

      // Check if user has enough balance
      if (userBalance < totalCost) {
        throw new Error("Insufficient balance");
      }

      // Update user's balance
      const newBalance = userBalance - totalCost;
      await connection.query("UPDATE users SET balance = ? WHERE id = ?", [
        newBalance,
        userId,
      ]);

      // Check if user already owns this stock
      const [userStockRows] = await connection.query<UserStock[]>(
        "SELECT id, quantity, average_buy_price FROM user_stocks WHERE user_id = ? AND stock_id = ?",
        [userId, stockId]
      );

      if (userStockRows.length > 0) {
        // Update existing stock holding
        const existingHolding = userStockRows[0];
        const newQuantity = existingHolding.quantity + quantity;
        const newAverageBuyPrice =
          (existingHolding.quantity * existingHolding.average_buy_price +
            totalCost) /
          newQuantity;

        await connection.query(
          "UPDATE user_stocks SET quantity = ?, average_buy_price = ? WHERE id = ?",
          [newQuantity, newAverageBuyPrice, existingHolding.id]
        );
      } else {
        // Create new stock holding
        await connection.query(
          "INSERT INTO user_stocks (user_id, stock_id, quantity, average_buy_price) VALUES (?, ?, ?, ?)",
          [userId, stockId, quantity, currentPrice]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } // In StockModel

  static async sellStock(
    userId: number,
    stockId: number,
    quantity: number,
    currentPrice: number
  ): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if user owns enough of this stock
      const [userStockRows] = await connection.query<UserStock[]>(
        "SELECT id, quantity, average_buy_price FROM user_stocks WHERE user_id = ? AND stock_id = ?",
        [userId, stockId]
      );

      if (userStockRows.length === 0 || userStockRows[0].quantity < quantity) {
        throw new Error("Insufficient stock quantity");
      }

      const existingHolding = userStockRows[0];
      const totalSaleAmount = currentPrice * quantity;

      // Get user's current balance
      const [userRows] = await connection.query<RowDataPacket[]>(
        "SELECT balance FROM users WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const currentBalance = parseFloat(userRows[0].balance);
      const newBalance = currentBalance + totalSaleAmount;

      // Check if new balance exceeds maximum allowed value
      const maxAllowedBalance = 999999999999.99;
      if (newBalance > maxAllowedBalance) {
        throw new Error("Transaction would exceed maximum allowed balance");
      }

      // Update user's balance
      const [updateResult] = await connection.query<ResultSetHeader>(
        "UPDATE users SET balance = ? WHERE id = ?",
        [newBalance.toFixed(2), userId]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error("Failed to update user balance");
      }

      // Update user's stock holding
      const newQuantity = existingHolding.quantity - quantity;
      if (newQuantity > 0) {
        await connection.query(
          "UPDATE user_stocks SET quantity = ? WHERE id = ?",
          [newQuantity, existingHolding.id]
        );
      } else {
        // If user sells all shares, remove the record
        await connection.query("DELETE FROM user_stocks WHERE id = ?", [
          existingHolding.id,
        ]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("Error in sellStock:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
