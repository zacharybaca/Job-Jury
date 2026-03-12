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
const getTopCompanies = asyncHandler(async (req, res) => {
  // 1. Find companies with at least one review AND are approved
  // 2. Sort by averageRating (-1 for descending)
  // 3. Limit to 3 results
  const topCompanies = await Company.find({
    averageRating: { $gt: 0 },
    isApproved: true,
  })
    .sort({ averageRating: -1 })
    .limit(3);

  res.status(200).json({ success: true, data: topCompanies });
});

// @desc    Get all approved companies (PUBLIC)
// @route   GET /api/companies
const getCompanies = asyncHandler(async (req, res) => {
  // Only return approved companies to the frontend Browse page
  const companies = await Company.find({ isApproved: true }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json({ success: true, count: companies.length, data: companies });
});

// @desc    Get ALL companies (ADMIN ONLY)
// @route   GET /api/companies/all-admin
const getAllCompaniesAdmin = asyncHandler(async (req, res) => {
  // Bypasses the isApproved filter so the admin sees both pending and approved
  const companies = await Company.find().sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: companies.length, data: companies });
});

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

// @desc    Approve a pending company
// @route   PATCH /api/companies/:id/approve
const approveCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Flip the approval switch to true
  company.isApproved = true;
  const updatedCompany = await company.save();

  res.status(200).json({ success: true, data: updatedCompany });
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

// @desc    Get logged in user's submitted companies
// @route   GET /api/companies/my-submissions
const getMyCompanies = asyncHandler(async (req, res) => {
  // Find companies where the creator matches the logged-in user
  const companies = await Company.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json({ success: true, count: companies.length, data: companies });
});

// @desc    Update a user's pending company
// @route   PUT /api/companies/my-submissions/:id
const updateMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (company.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to edit this company.");
  }

  if (company.isApproved) {
    res.status(400);
    throw new Error(
      "Cannot edit an approved company. Please contact an admin.",
    );
  }

  if (req.body.name && req.body.name !== company.name) {
    const nameExists = await Company.findOne({ name: req.body.name });
    if (nameExists) {
      res.status(400);
      throw new Error(
        "Another company is already registered or pending review with that exact name.",
      );
    }
  }

  // NEW: Handle Cloudinary Image Replacement
  if (req.file) {
    // 1. If an old image exists, destroy it in Cloudinary to prevent orphaned files
    if (company.imagePublicId) {
      await cloudinary.uploader.destroy(company.imagePublicId);
    }
    // 2. Attach the new Cloudinary URLs provided by the Multer middleware
    company.imageUrl = req.file.path;
    company.imagePublicId = req.file.filename;
  }

  // Update text fields
  company.name = req.body.name || company.name;
  company.industry = req.body.industry || company.industry;
  company.location = req.body.location || company.location;
  company.description = req.body.description || company.description;

  const updatedCompany = await company.save();
  res.status(200).json({ success: true, data: updatedCompany });
});

// @desc    Delete a user's pending company
// @route   DELETE /api/companies/my-submissions/:id
const deleteMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (company.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this company.");
  }

  if (company.isApproved) {
    res.status(400);
    throw new Error(
      "Cannot delete an approved company. Please contact an admin.",
    );
  }

  await company.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Pending submission removed." });
});

export {
  createCompany,
  getCompanies,
  getAllCompaniesAdmin,
  getCompany,
  getTopCompanies,
  deleteCompany,
  approveCompany,
  getMyCompanies,
  updateMyCompany,
  deleteMyCompany,
};
