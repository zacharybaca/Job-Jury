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
  submitCompanyClaim, // NEW
  getPendingClaims, // NEW
  updateClaimStatus, // NEW
} from "../controllers/userController.js";
import { protect, admin, isEmployer } from "../middleware/authMiddleware.js";
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

// --- NEW: Employer Specific Routes ---
router.post(
  "/claim-company",
  isEmployer,
  upload.single("verificationDocument"),
  submitCompanyClaim,
);

// Apply admin access to everything below it
router.use(admin);

// --- NEW: Admin Claim Management ---
router.get("/pending-claims", getPendingClaims);
router.patch("/:id/claim-status", updateClaimStatus);

router.route("/").get(getUsers).post(createUserAsAdmin);

router.patch("/:id/admin", makeUserAdmin);
router.patch("/:id/demote", demoteUserAdmin);
router.patch("/:id/subscription", changeSubscriptionTier);
router.patch("/:id/suspend", toggleUserSuspension);

router.get("/fix-my-account", fixCorruptedData);

export default router;
