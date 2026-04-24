import Review from "../models/Review.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const getUserFeed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const followedCompanies = user.savedCompanies;

  if (!followedCompanies || followedCompanies.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }

  const reviews = await Review.find({ company: { $in: followedCompanies } })
    .populate("company", "name")
    .populate("author", "username avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  const feed = reviews.map((review) => ({
    _id: review._id,
    type: "review",
    company: review.company,
    author: review.author,
    rating: review.rating,
    content: review.comment || review.text,
    createdAt: review.createdAt,
  }));

  res.status(200).json({ success: true, data: feed });
});
