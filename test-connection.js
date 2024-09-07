const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "your_user",
  password: "your_user_password",
  database: "your_database_name",
  port: 3306,
  ssl: {
    ca: fs.readFileSync("./ssl/ca-cert.pem"),
    cert: fs.readFileSync("./ssl/server-cert.pem"),
    key: fs.readFileSync("./ssl/server-key.pem"),
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
