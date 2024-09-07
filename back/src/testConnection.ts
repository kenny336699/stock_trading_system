import pool from "../src/config/db"; // Replace with the actual path to your db config file

export async function testDatabaseConnection() {
  try {
    // Attempt to get a connection from the pool
    const connection = await pool.getConnection();
    console.log("Successfully connected to the database.");

    // Run a simple query
    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    console.log("Query result:", rows);

    // Release the connection back to the pool
    connection.release();

    console.log("Connection released. Test completed successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // End the pool
    await pool.end();
  }
}
