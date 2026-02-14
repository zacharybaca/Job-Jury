import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Fail Fast Safety Check
// This prevents the server from hanging or giving vague errors if .env is missing
if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// 2. Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1); // Exit if DB fails to connect
  });

// 3. Graceful Shutdown
// Ensures MongoDB connection closes cleanly when you stop the server (Ctrl+C)
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
