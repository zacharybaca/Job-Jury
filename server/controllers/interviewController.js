import Interview from "../models/Interview.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

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

  // Wrapped in try/catch to prevent corrupted watchlist data from crashing the server
  try {
    const watchers = await User.find({
      watchlist: companyId,
      subscriptionTier: { $in: ["juror", "judge"] },
    });
    watchers.forEach(w => console.log(`Notification trigger: ${w.email}`));
  } catch (err) {
    console.error("Non-blocking notification failure:", err.message);
  }

  return res.status(201).json({
    success: true,
    data: newInterview,
    message: "Evidence successfully logged.",
  });
});

// Analytics Handler
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

// CRUD Handlers
export const getInterviewsByCompany = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ company: req.params.companyId })
    .populate("user", "username avatar")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: interviews });
});

export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.params.userId })
    .populate("company", "name")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: interviews });
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview || (interview.user.toString() !== req.user._id.toString() && !req.user.isAdmin)) {
    res.status(403);
    throw new Error("Unauthorized.");
  }
  await Interview.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: "Deleted." });
});
