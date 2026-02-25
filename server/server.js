// 1. Load environment variables BEFORE any other imports
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Fail Fast Safety Check
if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// 2. Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Ensure we are listening on the correct port from .env
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// 3. Graceful Shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});
