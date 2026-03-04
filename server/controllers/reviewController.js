import Review from "../models/Review.js";
import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new review and update company average
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { companyId, rating, body, jobTitle } = req.body;

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
    body,
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

// @desc    Delete a review and update company average
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;

  // 1. Find the review first to get the company ID
  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const companyId = review.company;

  // 2. Remove the review from the Database
  await Review.findByIdAndDelete(reviewId);

  // 3. Remove the review reference from the Company's 'reviews' array
  await Company.findByIdAndUpdate(companyId, {
    $pull: { reviews: reviewId },
  });

  // 4. Recalculate and update the average rating for the company
  const remainingReviews = await Review.find({ company: companyId });

  let newAverage = 0;
  if (remainingReviews.length > 0) {
    const total = remainingReviews.reduce((sum, item) => sum + item.rating, 0);
    newAverage = (total / remainingReviews.length).toFixed(1);
  }

  await Company.findByIdAndUpdate(companyId, {
    averageRating: Number(newAverage),
  });

  res.status(200).json({
    success: true,
    message: "Review removed and average rating updated."
  });
});
