import express from "express";
import Company from "../models/Company.js";
import { upload } from "../config/cloudinary.js"; // Import your multer/cloudinary config
import asyncHandler from "express-async-handler";

// @desc Create new company
// @route POST /api/companies
// @access Public

const createCompany = asyncHandler("/", upload.single("image"), async (req, res, next) => {
  try {
    const { name, industry, location, description } = req.body;

    const newCompany = new Company({
      name,
      industry,
      location,
      description,
      imageUrl: req.file ? req.file.path : "", // Cloudinary URL provided by Multer
    });

    const savedCompany = await newCompany.save();
    res.status(201).json({ success: true, data: savedCompany });
  } catch (error) {
    next(error); // Pass to your errorHandler middleware
  }
});

// @desc Get all companies
// @route GET /api/companies
// @access Public

const getCompanies = asyncHandler("/", async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    next(error);
  }
});

// @desc Get company and reviews
// @route GET /api/companies/:id
// @access Public

const getCompany = asyncHandler("/:id", async (req, res, next) => {
  try {
    // .populate('reviews') swaps the ID numbers for the actual review content
    const company = await Company.findById(req.params.id).populate('reviews');

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

export { createCompany, getCompanies, getCompany };
