import express from "express";
import {
  createInterview,
  getInterviewsByCompany,
  getInterviewsByUser,
  deleteInterview,
  updateInterview,
} from "../controllers/interviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, createInterview);
router.get("/company/:companyId", getInterviewsByCompany);
router.get("/user/:userId", getInterviewsByUser);
router.delete("/:id", protect, deleteInterview);
router.put("/:id", protect, updateInterview);

export default router;
