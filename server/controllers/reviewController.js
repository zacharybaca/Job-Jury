import Review from "../models/Review.js";
import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new review and update company average
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { companyId, rating, content, jobTitle } = req.body;

  // 1. Verify the company exists before doing anything
  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // 2. Create the new review
  const newReview = await Review.create({
    company: companyId,
    rating: Number(rating),
    content,
    jobTitle,
    author: req.user._id, // Provided by protect middleware
  });

  // 3. Fetch all reviews for this specific company
  const allReviews = await Review.find({ company: companyId });

  // 4. Calculate Average
  // We use .length of allReviews to ensure accuracy
  const total = allReviews.reduce((sum, item) => sum + item.rating, 0);
  const updatedAverage = (total / allReviews.length).toFixed(1);

  // 5. Dual Update: Push Review ID and Update the running Average
  await Company.findByIdAndUpdate(companyId, {
    $push: { reviews: newReview._id },
    averageRating: Number(updatedAverage), // Convert back to number for the schema
  });

  res.status(201).json({
    success: true,
    data: newReview,
    message: "Verdict submitted successfully",
  });
});
