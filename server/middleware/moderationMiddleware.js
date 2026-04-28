import OpenAI from "openai";
import asyncHandler from "express-async-handler";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const moderateContent = asyncHandler(async (req, res, next) => {
  const textToModerate = req.body.body || req.body.comment || req.body.content || req.body.text;

  if (!textToModerate) {
    return next();
  }

  try {
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: textToModerate,
    });

    const result = response.results[0];

    if (result.flagged) {
      res.status(400);
      const violatedCategories = Object.keys(result.categories).filter(
        (category) => result.categories[category] === true
      );
      throw new Error(`Content rejected. Violates guidelines: ${violatedCategories.join(", ")}`);
    }

    next();
  } catch (error) {
    if (error.status === 429) {
      res.status(429);
      throw new Error("Moderation service is currently overloaded. Please try again in a few minutes.");
    }

    console.error("OpenAI API Error:", error.message);
    res.status(500);
    throw new Error("An error occurred during content verification.");
  }
});
