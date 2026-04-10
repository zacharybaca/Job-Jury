import Interview from "../models/Interview.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create a new interview
 * @route   POST /api/interviews/submit-leak
 * @access  Private
 */
export const createInterview = asyncHandler(async (req, res) => {
  // Fix: Destructure 'company' from req.body to match the frontend payload
  const { company: companyId, role, questions, difficulty, outcome } = req.body;

  if (!companyId) {
    res.status(400);
    throw new Error("Company ID is required");
  }

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
    outcome,
  });

  // Alert logic for premium tiers
  const watchers = await User.find({
    watchlist: companyId,
    subscriptionTier: { $in: ["juror", "judge"] },
  });

  watchers.forEach((watcher) => {
    console.log(`Alert: New interview for ${company.name} sent to ${watcher.email}`);
  });

  res.status(201).json({
    success: true,
    data: newInterview,
    message: "Interview submitted successfully",
  });
});

/**
 * @desc    Get interview analytics for a company
 * @route   GET /api/interviews/company/:companyId/analytics
 * @access  Public (Logic handles tier-lock on frontend)
 */
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

/**
 * @desc    Get all interviews for a company
 * @route   GET /api/interviews/company/:companyId
 */
export const getInterviewsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const interviews = await Interview.find({ company: companyId }).populate("user", "username avatar");

  res.status(200).json({
    success: true,
    data: interviews,
  });
});

/**
 * @desc    Delete an interview
 * @route   DELETE /api/interviews/:id
 */
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

  // Use deleteOne() as .remove() is deprecated in newer Mongoose versions
  await Interview.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
  });
});

// Logic for getInterviewsByUser and updateInterview remains the same
export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const interviews = await Interview.find({ user: userId });
  res.status(200).json({ success: true, data: interviews });
});

export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }
  const isAdmin = req.user && req.user.isAdmin === true;
  if (!isAdmin && interview.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  Object.assign(interview, req.body);
  const updated = await interview.save();
  res.status(200).json({ success: true, data: updated });
});
