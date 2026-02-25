// server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  toggleSaveCompany,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Move this ABOVE the 'router.use(protect)' line
// This allows the AuthProvider to ping the server.
router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// 2. NOW apply protection to everything below it
router.use(protect);

router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.post("/save/:companyId", toggleSaveCompany);

export default router;
