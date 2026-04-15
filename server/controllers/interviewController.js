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

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: Session missing.");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error(`Company ${companyId} not found in production database.`);
  }

  const newInterview = await Interview.create({
    company: companyId,
    user: req.user._id,
    role,
    questions,
    difficulty,
    outcome,
  });

  try {
    const watchers = await User.find({
      watchlist: companyId,
      subscriptionTier: { $in: ["juror", "judge"] },
    });
    watchers.forEach((w) => console.log(`Notification trigger: ${w.email}`));
  } catch (err) {
    console.error("Non-blocking notification failure:", err.message);
  }

  return res.status(201).json({
    success: true,
    data: newInterview,
    message: "Evidence successfully logged.",
  });
});

/**
 * @desc    Update an existing interview leak
 * @route   PUT /api/interviews/:id
 */
export const updateInterview = asyncHandler(async (req, res) => {
  const { role, questions, difficulty, outcome } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview record not found.");
  }

  // Authorization: Only the author or an admin can update
  const isAuthor = interview.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.isAdmin;

  if (!isAuthor && !isAdmin) {
    res.status(403);
    throw new Error("Unauthorized to modify this record.");
  }

  // Update fields
  interview.role = role || interview.role;
  interview.difficulty = difficulty !== undefined ? difficulty : interview.difficulty;
  interview.outcome = outcome || interview.outcome;
  interview.questions = questions || interview.questions;

  const updatedInterview = await interview.save();

  res.status(200).json({
    success: true,
    data: updatedInterview,
    message: "Interview updated successfully.",
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
 * @desc    Get all questions that were asked for a specific company and role
 * @desc    Get all questions that were asked for a specific company and role
 * @route   GET /api/interviews/company/:companyId/questions?role=Software%20Engineer
 * @query   role (optional) - filter questions by role
 */
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const { role } = req.query;

  const query = { company: companyId };
  if (role) query.role = role;

  const interviews = await Interview.find(query).select("questions");

  // Extract text from nested question objects
  const questionTexts = interviews.flatMap((interview) =>
    interview.questions.map((q) => q.text)
  );

  res.status(200).json({
    success: true,
    questions: questionTexts,
  });
});

/**
 * @desc    Get all interviews for a specific company
 * @route   GET /api/interviews/company/:companyId
 */
export const getInterviewsByCompany = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ company: req.params.companyId })
    .populate("user", "username avatar")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: interviews });
});

/**
 * @desc    Get all interviews submitted by a specific user
 * @route   GET /api/interviews/user/:userId
 */
export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.params.userId })
    .populate("company", "name")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: interviews });
});

/**
 * @desc    Delete an interview leak
 * @route   DELETE /api/interviews/:id
 */
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview record not found.");
  }

  // Authorization: Only the author or an admin can delete
  const isAuthor = interview.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.isAdmin;

  if (!isAuthor && !isAdmin) {
    res.status(403);
    throw new Error("Unauthorized.");
  }

  await Interview.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: "Deleted." });
});
