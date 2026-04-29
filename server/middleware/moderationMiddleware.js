import OpenAI from "openai";
import asyncHandler from "express-async-handler";
import Bottleneck from "bottleneck";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure the limiter for the Free Plan (3 Requests Per Minute)
// We set it to 1 request every 20500ms to be safe.
const limiter = new Bottleneck({
  minTime: 20500, // Wait ~20.5 seconds between starts
  maxConcurrent: 1 // Only one request at a time
});

export const moderateContent = asyncHandler(async (req, res, next) => {
  const textToModerate = req.body.body || req.body.comment || req.body.content || req.body.text;

  if (!textToModerate) {
    return next();
  }

  try {
    // Wrap the OpenAI call in the limiter
    const response = await limiter.schedule(() =>
      openai.moderations.create({
        model: "omni-moderation-latest",
        input: textToModerate,
      })
    );

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
    // If the queue gets too backed up or OpenAI still hits you with a 429
    if (error.status === 429 || error.name === 'BottleneckError') {
      res.status(429);
      throw new Error("System is busy processing other requests. Please wait a moment.");
    }

    console.error("OpenAI API Error:", error.message);
    res.status(500);
    throw new Error("An error occurred during content verification.");
  }
});
