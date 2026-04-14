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

  // 1. Guard against missing user session
  if (!req.user) {
    console.error("AUTH ERROR: req.user is undefined in production.");
    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
  }

  // 2. Guard against missing Company
  const company = await Company.findById(companyId);
  if (!company) {
    console.error(`DB ERROR: Company ${companyId} not found in Production.`);
    return res.status(404).json({ success: false, message: "Target company does not exist in production database." });
  }

  // 3. Save the Leak
  const newInterview = await Interview.create({
    company: companyId,
    user: req.user._id,
    role,
    questions,
    difficulty,
    outcome,
  });

  // 4. Side-effects (Wrapped so they CANNOT crash the response)
  try {
    const watchers = await User.find({
      watchlist: companyId,
      subscriptionTier: { $in: ["juror", "judge"] },
    });
    watchers.forEach(w => console.log(`Notified: ${w.email}`));
  } catch (err) {
    console.error("ALERT ERROR: Notification logic failed, but leak was saved:", err.message);
  }

  // 5. Explicit JSON Response
  return res.status(201).json({
    success: true,
    data: newInterview,
    message: "Evidence successfully logged.",
  });
});

/**
 * @desc    Get interview analytics
 * @route   GET /api/interviews/company/:companyId/analytics
 */
export const getInterviewAnalytics = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const interviews = await Interview.find({ company: companyId });

  const avgDifficulty = interviews.length
    ? (interviews.reduce((acc, curr) => acc + curr.difficulty, 0) / interviews.length).toFixed(1)
    : "0.0";

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
  const interviews = await Interview.find({ company: req.params.companyId })
    .populate("user", "username avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: interviews,
  });
});

/**
 * @desc    Get interviews by user
 * @route   GET /api/interviews/user/:userId
 */
export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.params.userId })
    .populate("company", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: interviews,
  });
});

/**
 * @desc    Update an interview
 * @route   PUT /api/interviews/:id
 */
export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview record not found.");
  }

  const isAdmin = req.user && req.user.isAdmin;
  if (!isAdmin && interview.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized to modify this record.");
  }

  Object.assign(interview, req.body);
  const updatedInterview = await interview.save();

  res.status(200).json({
    success: true,
    data: updatedInterview,
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
    throw new Error("Interview record not found.");
  }

  const isAdmin = req.user && req.user.isAdmin;
  if (!isAdmin && interview.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized to delete this record.");
  }

  await Interview.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully.",
  });
});
