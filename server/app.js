import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { stripeWebhook } from "./controllers/paymentController.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL?.replace(/\/$/, ""),
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/payments", paymentRoutes);

// Static Asset Handling for Production (Render)
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const clientPath = path.join(__dirname, "client", "dist");

  app.use(express.static(clientPath));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(clientPath, "index.html")),
  );
}

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
