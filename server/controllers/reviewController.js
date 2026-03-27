import Review from "../models/Review.js";
import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new review and update company average
// @route   POST /api/reviews
export const createReview = asyncHandler(async (req, res) => {
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
    isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
    author: req.user._id,
  });

  // Manually update company average rating and reviews array
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
    throw new Error(`Review not found with id of ${req.params.id}`);
  }

  // Permission Logic: Check if user is an Admin or the Author
  const isAdmin = req.user && req.user.isAdmin === true;
  const userId = req.user?._id?.toString();

  // Safeguard against missing author field or transformed anonymity objects
  const authorId = review.author?._id?.toString() || review.author?.toString();
  const isAuthor = authorId && userId && authorId === userId;

  if (!isAdmin && !isAuthor) {
    res.status(403);
    throw new Error("Not authorized to delete this verdict");
  }

  // 1. Remove review ID from the Company's reviews array
  await Company.findByIdAndUpdate(review.company, {
    $pull: { reviews: review._id },
  });

  // 2. Trigger the automated calculation via the model hook in Review.js
  // Note: Your schema requires .deleteOne() on the instance to trigger the middleware
  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review removed and company ratings updated."
  });
});

// @desc    Flag a review as inappropriate
// @route   PATCH /api/reviews/:id/inappropriate
export const flagReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.markedInappropriate = true;
  await review.save();

  res.status(200).json({ success: true, data: review });
});

// @desc    Fetch all flagged reviews for admin approval
// @route   GET /api/reviews/flagged
export const getFlaggedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ markedInappropriate: true })
    .populate("author", "username")
    .populate("company", "name");

  res.status(200).json({
    success: true,
    data: reviews
  });
});

// @desc    Approve a flagged review (clear the flag)
// @route   PATCH /api/reviews/:id/approve
export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.markedInappropriate = false;
  await review.save();

  res.status(200).json({
    success: true,
    data: review,
    message: "Review cleared and approved."
  });
});
