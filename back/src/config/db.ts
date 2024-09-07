import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "user01",
  password: "P@ssw0rd",
  database: "stock_trading_system",
  port: 3306,
  ssl: {
    ca: fs.readFileSync("../ssl/ca-cert.pem"),
    cert: fs.readFileSync("../ssl/client-cert.pem"),
    key: fs.readFileSync("../ssl/client-key.pem"),
  },
});

export default pool;
