import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Import this
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"; // 2. Import reviews
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser()); // 3. Use this before your routes!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/reviews", reviewRoutes); // 4. Add the review route

// Error handling
app.use(errorHandler);

export default app;
