import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/reviews
// Protected: Only logged-in users can post a verdict
router.post("/", protect, createReview);

router.delete("/:id", protect, deleteReview);

export default router;
