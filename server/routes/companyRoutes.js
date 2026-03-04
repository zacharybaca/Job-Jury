import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { upload } from "../middleware/cloudinary.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// The upload middleware must stay here in the route definition
router.post("/", upload.single("image"), createCompany);
router.get("/", getCompanies);
router.get("/:id", getCompany);
router.delete("/:id", protect, admin, deleteCompany);

export default router;
