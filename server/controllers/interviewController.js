import Interview from '../models/Interview.js';
import Company from '../models/Company.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new interview
// @route   POST /api/interviews
export const createInterview = asyncHandler(async (req, res) => {
  const { companyId, role, questions, difficulty, outcome } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const newInterview = await Interview.create({
    company: companyId,
    user: req.user._id,
    role,
    questions,
    difficulty,
    outcome
  });

  const watchers = await User.find({
    watchlist: companyId,
    subscriptionTier: { $in: ["juror", "judge"] },
  });

  watchers.forEach((watcher) => {
    console.log( `Alert: New interview for company ${companyId} sent to ${watcher.email}` );
  });

  res.status(201).json({
    success: true,
    data: newInterview,
    message: "Interview submitted successfully",
  });
});

// @desc    Get all interviews for a company
// @route   GET /api/interviews/company/:companyId
export const getInterviewsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const interviews = await Interview.find({ company: companyId });

  res.status(200).json({
    success: true,
    data: interviews,
    message: "Interviews retrieved successfully",
  });
});

// @desc    Get all interviews by a user
// @route   GET /api/interviews/user/:userId
export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const interviews = await Interview.find({ user: userId });

  res.status(200).json({
    success: true,
    data: interviews,
    message: "Interviews retrieved successfully",
  });
});

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

   // Permission Logic: Check if user is an Admin or the Author
  const isAdmin = req.user && req.user.isAdmin === true;
  const userId = req.user?._id?.toString();
    if (!isAdmin && interview.user.toString() !== userId) {
    res.status(403);
    throw new Error("Not authorized to delete this interview");
  }

  await interview.remove();

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
  });
});

// @desc    Update an interview
// @route   PUT /api/interviews/:id
export const updateInterview = asyncHandler(async (req, res) => {
  const { role, questions, difficulty, outcome } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

   // Permission Logic: Check if user is an Admin or the Author
  const isAdmin = req.user && req.user.isAdmin === true;
  const userId = req.user?._id?.toString();
    if (!isAdmin && interview.user.toString() !== userId) {
    res.status(403);
    throw new Error("Not authorized to update this interview");
  }

  interview.role = role || interview.role;
  interview.questions = questions || interview.questions;
  interview.difficulty = difficulty || interview.difficulty;
  interview.outcome = outcome || interview.outcome;

  const updatedInterview = await interview.save();

  res.status(200).json({
    success: true,
    data: updatedInterview,
    message: "Interview updated successfully",
  });
});
