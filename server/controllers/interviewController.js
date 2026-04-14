import Interview from "../models/Interview.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create a new interview (Leak Submission)
 * @route   POST /api/interviews/submit-leak
 */
export const createInterview = asyncHandler(async (req, res) => {
  const { company: companyId, role, questions, difficulty, outcome } = req.body;

  // 1. DEFENSIVE CHECK: Ensure req.user exists from the protect middleware
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("User session is invalid or undefined. Please log out and log back in.");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // 2. Create the Interview
  const newInterview = await Interview.create({
    company: companyId,
    user: req.user._id,
    role,
    questions,
    difficulty,
    outcome,
  });

  // 3. Alert Logic: Using a try/catch here so if your 'watchlist' is still
  // corrupted, it won't crash the whole submission.
  try {
    const watchers = await User.find({
      watchlist: companyId,
      subscriptionTier: { $in: ["juror", "judge"] },
    });

    watchers.forEach((watcher) => {
      console.log(`Alert: New leak for ${company.name} sent to ${watcher.email}`);
    });
  } catch (error) {
    console.error("Non-critical Alert Error (likely corrupted watchlist data):", error.message);
  }

  res.status(201).json({
    success: true,
    data: newInterview,
    message: "Interview submitted successfully",
  });
});

// @desc    Get interview analytics for a company
// @route   GET /api/interviews/company/:companyId/analytics
export const getInterviewAnalytics = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const interviews = await Interview.find({ company: companyId });

  const avgDifficulty = interviews.length
    ? (interviews.reduce((acc, curr) => acc + curr.difficulty, 0) / interviews.length).toFixed(1)
    : 0;

  const recentLeaks = interviews
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((i) => `${i.role} - ${i.outcome}`);

  res.status(200).json({
    success: true,
    avgDifficulty,
    recentLeaks,
  });
});

// @desc    Get all interviews for a company
// @route   GET /api/interviews/company/:companyId
export const getInterviewsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const interviews = await Interview.find({ company: companyId }).populate("user", "username avatar");

  res.status(200).json({
    success: true,
    data: interviews,
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

  const isAdmin = req.user && req.user.isAdmin === true;
  const userId = req.user?._id?.toString();
  if (!isAdmin && interview.user.toString() !== userId) {
    res.status(403);
    throw new Error("Not authorized to delete this interview");
  }

  // Fix: Use deleteOne() to replace deprecated remove()
  await Interview.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
  });
});

export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const interviews = await Interview.find({ user: userId });
  res.status(200).json({ success: true, data: interviews });
});

export const updateInterview = asyncHandler(async (req, res) => {
  const { role, questions, difficulty, outcome } = req.body;
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  const isAdmin = req.user && req.user.isAdmin === true;
  if (!isAdmin && interview.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this interview");
  }

  interview.role = role || interview.role;
  interview.questions = questions || interview.questions;
  interview.difficulty = difficulty || interview.difficulty;
  interview.outcome = outcome || interview.outcome;

  const updatedInterview = await interview.save();
  res.status(200).json({ success: true, data: updatedInterview });
});
