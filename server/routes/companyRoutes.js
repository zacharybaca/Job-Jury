import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
} from "../controllers/companyController.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

// The upload middleware must stay here in the route definition
router.post("/", upload.single("image"), createCompany);
router.get("/", getCompanies);
router.get("/:id", getCompany);

export default router;
