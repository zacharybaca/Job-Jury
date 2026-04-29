import leoProfanity from "leo-profanity";
import asyncHandler from "express-async-handler";

// Initialize default English dictionary
leoProfanity.loadDictionary('en');

export const moderateContent = asyncHandler(async (req, res, next) => {
  const textToModerate = req.body.body || req.body.comment || req.body.content || req.body.text;

  if (!textToModerate) {
    return next();
  }

  // Evaluates text against the local dictionary synchronously
  const isFlagged = leoProfanity.check(textToModerate);

  if (isFlagged) {
    res.status(400);
    throw new Error("Content rejected. Violates community guidelines regarding profanity.");
  }

  next();
});
