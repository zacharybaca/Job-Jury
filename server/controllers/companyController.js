import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary"; // Import to handle image deletion

// @desc    Create a new company
// @route   POST /api/companies
const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, location, description } = req.body;

  const newCompany = new Company({
    name,
    industry,
    location,
    description,
    imageUrl: req.file ? req.file.path : "",
    // If you store the public_id from Cloudinary, it makes deletion easier
    // req.file.filename usually contains the public_id in multer-storage-cloudinary
    imagePublicId: req.file ? req.file.filename : "",
  });

  const savedCompany = await newCompany.save();
  res.status(201).json({ success: true, data: savedCompany });
});

// @desc    Get all companies
// @route   GET /api/companies
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res
    .status(200)
    .json({ success: true, count: companies.length, data: companies });
});

// @desc    Get single company
// @route   GET /api/companies/:id
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
    .populate("reviews")
    .lean();

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.status(200).json({ success: true, data: company });
});

// @desc    Delete a company
// @route   DELETE /api/companies/:id
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Trigger the middleware by calling deleteOne on the document instance
  await company.deleteOne();

  res.status(200).json({ success: true, message: "Company and associated assets removed." });
});

export { createCompany, getCompanies, getCompany, deleteCompany };
