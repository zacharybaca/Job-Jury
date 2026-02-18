import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  toggleSaveCompany,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protection to all routes in this file
router.use(protect);

router.route("/profile").get(getUserProfile).put(updateUserProfile);

router.post("/save/:companyId", toggleSaveCompany);

export default router;
