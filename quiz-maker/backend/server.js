// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

const app = express();

// connect to MongoDB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Online Quiz Maker API is running");
});

// routes
app.use("/api/quizzes", quizRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
