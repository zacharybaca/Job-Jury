import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const corsOptions = {
  // Allow requests from your Vite frontend
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // Critical for cookies/sessions
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

// Error handling
app.use(errorHandler);

export default app;
