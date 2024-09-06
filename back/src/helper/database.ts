import mysql, { Pool } from "mysql2/promise";

import dotenv from "dotenv";
dotenv.config();
// Create a connection pool
const pool: Pool = mysql.createPool({
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
  host: "127.0.0.1",
  user: "root",
  password: "P@ssw0rd",
  port: 3306,
});

export const runQuery = async (
  query: string,
  values: any[] | null
): Promise<any> => {
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Execute the query
    const [rows] = await conn.execute(query, values);

    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    return error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
};

export const runInsert = async (sql: string, values: any[]) => {
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Execute the insert query
    const [result] = await conn.execute(sql, values);

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    return error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
};

export const runUpdate = async (sql: string, values: any[]) => {
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Execute the update query
    const [result] = await conn.execute(sql, values);

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    return error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
};
export const runDelete = async (sql: string, values: any[]) => {
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Execute the delete query
    const [result] = await conn.execute(sql, values);

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    return error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
};
