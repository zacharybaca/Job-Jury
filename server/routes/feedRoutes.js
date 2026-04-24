import express from "express";
import { getUserFeed } from "../controllers/feedController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserFeed);

export default router;
