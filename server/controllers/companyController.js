import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, location, description } = req.body;

  const newCompany = new Company({
    name,
    industry,
    location,
    description,
    imageUrl: req.file ? req.file.path : "",
  });

  const savedCompany = await newCompany.save();
  res.status(201).json({ success: true, data: savedCompany });
});

const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: companies.length, data: companies });
});

const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('reviews');

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.status(200).json({ success: true, data: company });
});

export { createCompany, getCompanies, getCompany };
