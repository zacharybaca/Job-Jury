import express from "express";
import {
  createInterview,
  getInterviewsByCompany,
  getInterviewsByUser,
  deleteInterview,
  updateInterview,
  getInterviewAnalytics, // Import the new analytics controller
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/company/:companyId", getInterviewsByCompany);
router.get("/company/:companyId/analytics", getInterviewAnalytics); // New Endpoint
router.get("/user/:userId", getInterviewsByUser);

// Protected Routes
router.post("/submit-leak", protect, createInterview);
router.delete("/:id", protect, deleteInterview);
router.put("/:id", protect, updateInterview);

export default router;
