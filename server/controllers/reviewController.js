import Review from '../models/Review.js';
import Company from '../models/Company.js';
import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(async (req, res) => {
  const { companyId, rating, content, jobTitle } = req.body;

  // 1. Create the new review (ensure req.user exists from protect middleware)
  const newReview = await Review.create({
    company: companyId,
    rating: Number(rating),
    content,
    jobTitle,
    author: req.user._id
  });

  // 2. Fetch all ratings for this company to get a fresh average
  const allReviews = await Review.find({ company: companyId });

  // 3. Calculate Average
  const total = allReviews.reduce((sum, item) => sum + item.rating, 0);
  const updatedAverage = (total / allReviews.length).toFixed(1);

  // 4. Update the Company document (Dual Update)
  await Company.findByIdAndUpdate(companyId, {
    $push: { reviews: newReview._id },
    averageRating: updatedAverage
  });

  res.status(201).json({ success: true, data: newReview });
});
