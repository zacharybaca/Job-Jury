import express from "express";
import {
  createInterview,
  getInterviewsByCompany,
  getInterviewsByUser,
  deleteInterview,
  updateInterview,
  getInterviewAnalytics,
} from "../controllers/interviewController.js";
import { protect, requireTier } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Access
router.get("/company/:companyId", getInterviewsByCompany);
router.get("/company/:companyId/analytics", getInterviewAnalytics);
router.get("/user/:userId", getInterviewsByUser);

// Protected Access: User must be logged in AND have at least a 'juror' tier
router.post("/submit-leak", protect, requireTier("juror"), createInterview);

// Protected Management
router.delete("/:id", protect, deleteInterview);
router.put("/:id", protect, updateInterview);

export default router;
