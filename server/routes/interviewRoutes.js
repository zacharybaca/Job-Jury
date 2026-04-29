import express from "express";
import {
  createInterview,
  getInterviewsByCompany,
  getInterviewsByUser,
  deleteInterview,
  updateInterview,
  getInterviewAnalytics,
  getInterviewQuestions,
} from "../controllers/interviewController.js";
import { protect, requireTier } from "../middleware/authMiddleware.js";
import { moderateContent } from "../middleware/moderationMiddleware.js";

const router = express.Router();

// Public data retrieval
router.get("/company/:companyId", getInterviewsByCompany);
router.get("/company/:companyId/analytics", getInterviewAnalytics);
router.get("/user/:userId", getInterviewsByUser);

// Protected submission and management
router.post(
  "/submit-leak",
  protect,
  requireTier("juror"),
  moderateContent,
  createInterview,
);
router.get(
  "/company/:companyId/questions",
  protect,
  requireTier("juror"),
  getInterviewQuestions,
);
router.put("/:id", protect, moderateContent, updateInterview);
router.delete("/:id", protect, moderateContent, deleteInterview);

export default router;
