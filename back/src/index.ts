import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import stockRoutes from "./routes/stock";
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Use authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
