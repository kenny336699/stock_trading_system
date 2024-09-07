const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "user01",
  password: "P@ssw0rd",
  database: "stock_trading_system",
  port: 3306,
  ssl: {
    ca: fs.readFileSync("./ssl/ca-cert.pem"),
    cert: fs.readFileSync("./ssl/client-cert.pem"),
    key: fs.readFileSync("./ssl/client-key.pem"),
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MariaDB database");

  // Run a test query
  connection.query("SELECT 1 + 1 AS solution", (err, results, fields) => {
    if (err) throw err;
    console.log("Test query result:", results[0].solution);
    connection.end();
  });
});
