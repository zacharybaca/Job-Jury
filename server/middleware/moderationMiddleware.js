import OpenAI from "openai";
import asyncHandler from "express-async-handler";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const moderateContent = asyncHandler(async (req, res, next) => {
  // Extract text fields based on your specific payload structure
  const textToModerate = req.body.body || req.body.comment || req.body.content || req.body.text;

  if (!textToModerate) {
    return next();
  }

  const response = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: textToModerate,
  });

  const result = response.results[0];

  if (result.flagged) {
    res.status(400);
    // Identify the specific violation categories for logging or user feedback
    const violatedCategories = Object.keys(result.categories).filter(
      (category) => result.categories[category] === true
    );

    throw new Error(`Content rejected. Violates guidelines: ${violatedCategories.join(", ")}`);
  }

  next();
});
