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

router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
