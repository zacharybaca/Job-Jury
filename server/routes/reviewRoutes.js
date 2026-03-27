import express from "express";
// Import the new controller function
import {
  createReview,
  deleteReview,
  flagReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/reviews
// Protected: Only logged-in users can post a verdict
router.post("/", protect, createReview);

// PATCH /api/reviews/:id/inappropriate
// Protected: Only logged-in users can flag content
router.patch("/:id/inappropriate", protect, flagReview);

router.delete("/:id", protect, deleteReview);

export default router;
