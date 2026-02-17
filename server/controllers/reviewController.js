import Review from '../models/Review.js';
import Company from '../models/Company.js';

export const createReview = async (req, res, next) => {
  try {
    const { companyId, rating, content, jobTitle } = req.body;

    // 1. Create the new review
    const newReview = await Review.create({
      company: companyId,
      rating: Number(rating),
      content,
      jobTitle,
      author: req.user.id // From your auth middleware
    });

    // 2. Fetch all ratings for this company to get a fresh average
    const allReviews = await Review.find({ company: companyId });

    // 3. Calculate Average
    const total = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const updatedAverage = (total / allReviews.length).toFixed(1);

    // 4. Update the Company document (Dual Update)
    await Company.findByIdAndUpdate(companyId, {
      $push: { reviews: newReview._id }, // Add the review ID to the array
      averageRating: updatedAverage      // Update the running average
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    next(error);
  }
};
