import Review from "../models/Review.js";
import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new review and update company average
// @route   POST /api/reviews
export const createReview = asyncHandler(async (req, res) => {
  // Destructure isAnonymous here
  const { companyId, rating, body, jobTitle, isAnonymous } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const newReview = await Review.create({
    company: companyId,
    rating: Number(rating),
    body,
    jobTitle,
    // Use the destructured variable
    isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
    author: req.user._id,
  });

  const allReviews = await Review.find({ company: companyId });
  const total = allReviews.reduce((sum, item) => sum + item.rating, 0);
  const updatedAverage = (total / allReviews.length).toFixed(1);

  await Company.findByIdAndUpdate(companyId, {
    $push: { reviews: newReview._id },
    averageRating: Number(updatedAverage),
  });

  res.status(201).json({
    success: true,
    data: newReview,
    message: "Verdict submitted successfully",
  });
});

// @desc    Delete a review and update company average
// @route   DELETE /api/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (
    review.author.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  // 1. Remove review ID from Company array
  // FIX: Use the 'Company' import you already have at the top
  await Company.findByIdAndUpdate(review.company, {
    $pull: { reviews: review._id },
  });

  // 2. Trigger the automated calculation via the model hook
  await review.deleteOne();

  res.status(200).json({ success: true, message: "Review removed." });
});
