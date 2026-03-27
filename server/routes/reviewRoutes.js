import express from "express";
import {
  createReview,
  deleteReview,
  flagReview,
  getFlaggedReviews, // Add this
  approveReview      // Add this
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Ensure admin middleware is imported

const router = express.Router();

// Public/User Routes
router.post("/", protect, createReview);
router.patch("/:id/inappropriate", protect, flagReview);

// Admin Routes
// GET /api/reviews/flagged - Fetch only reported reviews
router.get("/flagged", protect, admin, getFlaggedReviews);

// PATCH /api/reviews/:id/approve - Clear the flag (mark as safe)
router.patch("/:id/approve", protect, admin, approveReview);

// DELETE /api/reviews/:id - Remove review entirely
router.delete("/:id", protect, deleteReview);

export default router;
