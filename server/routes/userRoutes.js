// server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  toggleSaveCompany,
  deleteUserProfile,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinary.js";
import { getUsers, makeUserAdmin } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Apply protection to everything below it
router.use(protect);

router
  .route("/profile")
  .get(getUserProfile)
  .put(upload.single("avatar"), updateUserProfile) // <-- INJECTED HERE
  .delete(deleteUserProfile);

router.post("/save/:companyId", toggleSaveCompany);

// Admin routes
router.use(admin);
router.get("/", getUsers);
router.patch("/:id/admin", makeUserAdmin);

export default router;
