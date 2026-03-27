import express from "express";
import {
  createReview,
  deleteReview,
  flagReview, // Logic should set markedInappropriate: true
  getFlaggedReviews,
  approveReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, createReview);
router.patch("/:id/inappropriate", protect, flagReview);

// Admin Routes
router.get("/flagged", protect, admin, getFlaggedReviews);
router.patch("/:id/approve", protect, admin, approveReview);
router.delete("/:id", protect, deleteReview);

export default router;
