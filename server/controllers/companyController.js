import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary"; // Import to handle image deletion

// @desc    Create a new company
// @route   POST /api/companies
const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, location, description } = req.body;

  // 1. Check for existing company to prevent duplicate errors
  const companyExists = await Company.findOne({ name });
  if (companyExists) {
    res.status(400);
    throw new Error(
      "A company with this name is already registered in the Jury's records.",
    );
  }

  const newCompany = new Company({
    name,
    industry,
    location,
    description,
    imageUrl: req.file ? req.file.path : "",
    imagePublicId: req.file ? req.file.filename : "",
    // 2. Attach the user ID from the 'protect' middleware
    createdBy: req.user ? req.user._id : null,
  });

  const savedCompany = await newCompany.save();
  res.status(201).json({ success: true, data: savedCompany });
});

// @desc    Get top rated companies for featured section
// @route   GET /api/companies/top
export const getTopCompanies = asyncHandler(async (req, res) => {
  // 1. Find companies with at least one review
  // 2. Sort by averageRating (-1 for descending)
  // 3. Limit to 3 results
  const topCompanies = await Company.find({ averageRating: { $gt: 0 } })
    .sort({ averageRating: -1 })
    .limit(3);

  res.status(200).json({ success: true, data: topCompanies });
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
// @desc    Get single company
// @route   GET /api/companies/:id
const getCompany = asyncHandler(async (req, res) => {
  /**
   * NESTED POPULATION:
   * 1. First, we populate the 'reviews' array.
   * 2. Inside each review, we populate the 'author' field.
   * 3. We use 'select' to only bring back the username, keeping data lean.
   */
  const company = await Company.findById(req.params.id)
    .populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } }, // Show newest reviews first
      populate: {
        path: "author",
        select: "username", // Only expose what we need for the UI
      },
    })
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
  // 1. Find the document instance
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  /** * 2. Trigger the middleware
   * CRITICAL: You must call .deleteOne() on the DOCUMENT instance,
   * not the Model (Company.findByIdAndDelete), otherwise the
   * { document: true } middleware won't trigger.
   */
  await company.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Company and assets removed." });
});

export { createCompany, getCompanies, getCompany, getTopCompanies, deleteCompany };
