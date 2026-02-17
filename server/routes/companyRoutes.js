import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany
} from "../controllers/companyController.js";

const router = express.Router();

router.post("/companies", createCompany);
router.get("/companies", getCompanies);
router.get("/companies/:id", getCompany);

export default router;
