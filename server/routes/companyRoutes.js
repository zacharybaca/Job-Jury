import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  getTopCompanies,
  deleteCompany,
  getAllCompaniesAdmin, // NEW
  approveCompany,       // NEW
} from "../controllers/companyController.js";
import { upload } from "../middleware/cloudinary.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// The upload middleware must stay here in the route definition
router.post("/", protect, upload.single("image"), createCompany);
router.get("/", getCompanies);
router.get("/top", getTopCompanies);

// NEW: Admin route to get all companies (Must be BEFORE /:id)
router.get("/all-admin", protect, admin, getAllCompaniesAdmin);

router.get("/:id", getCompany);

// NEW: Admin route to approve a company
router.patch("/:id/approve", protect, admin, approveCompany);

router.delete("/:id", protect, admin, deleteCompany);

export default router;
