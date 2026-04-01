import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  getMyCompanies,
  getTopCompanies,
  deleteCompany,
  getAllCompaniesAdmin, // NEW
  approveCompany, // NEW
  updateMyCompany, // NEW
  deleteMyCompany, // NEW
  getCompanyTrends, // NEW
} from "../controllers/companyController.js";
import { upload } from "../middleware/cloudinary.js";
import { admin, protect, requireTier } from "../middleware/authMiddleware.js";

const router = express.Router();

// The upload middleware must stay here in the route definition
router.post("/", protect, upload.single("image"), createCompany);
router.get("/", getCompanies);
router.get("/top", getTopCompanies);

// NEW: Admin route to get all companies (Must be BEFORE /:id)
router.get("/all-admin", protect, admin, getAllCompaniesAdmin);

router.get("/my-submissions", protect, getMyCompanies);

router.put(
  "/my-submissions/:id",
  protect,
  upload.single("image"),
  updateMyCompany,
);

router.delete("/my-submissions/:id", protect, deleteMyCompany);

router.get("/:id", getCompany);

router.get("/:id/trends", protect, requireTier("judge"), getCompanyTrends);

// NEW: Admin route to approve a company
router.patch("/:id/approve", protect, admin, approveCompany);

router.delete("/:id", protect, admin, deleteCompany);

export default router;
