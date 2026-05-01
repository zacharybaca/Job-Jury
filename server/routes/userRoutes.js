// server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  toggleSaveCompany,
  deleteUserProfile,
  demoteUserAdmin,
  fixCorruptedData,
  changeSubscriptionTier,
  toggleUserSuspension,
  getUsers,
  makeUserAdmin,
  createUserAsAdmin,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Apply protection to everything below it
router.use(protect);

router
  .route("/profile")
  .get(getUserProfile)
  .put(upload.single("avatar"), updateUserProfile)
  .delete(deleteUserProfile);

router.post("/save/:companyId", toggleSaveCompany);

// Apply admin access to everything below it
router.use(admin);

router.route("/")
  .get(getUsers)
  .post(createUserAsAdmin);

router.patch("/:id/admin", makeUserAdmin);
router.patch("/:id/demote", demoteUserAdmin);
router.patch("/:id/subscription", changeSubscriptionTier);
router.patch("/:id/suspend", toggleUserSuspension);

// Temporary route
router.get("/fix-my-account", fixCorruptedData);

export default router;
