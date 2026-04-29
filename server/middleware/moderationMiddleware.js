import leoProfanity from "leo-profanity";
import asyncHandler from "express-async-handler";

// Initialize default English dictionary
leoProfanity.loadDictionary("en");

// Append custom terms to the active memory array
leoProfanity.add([
  "loser",
  "idiot",
  "dumb",
  "ignorant",
  "stupid",
  "moron",
  "fool",
  "jerk",
  "sociopath",
  "slave driver",
  "bloodsucker",
  "brownnoser",
  "kiss-ass",
  "scam artist",
  "crook",
  "extortionist",
  "nazi",
  "fascist",
  "psycho",
  "bootlicker",
  "shill",
  "scab",
  "brain-dead",
  "sweatshop",
  "narcissist",
  "megalomaniac",
  "tyrant",
  "dictator",
  "parasite",
  "leech",
  "fraud",
  "con artist",
  "charlatan",
  "backstabber",
  "snake",
  "creep",
  "pervert",
  "groomer",
  "dirtbag",
  "scum",
  "sycophant",
  "nepo baby",
  "thief",
  "embezzler",
]);

export const moderateContent = asyncHandler(async (req, res, next) => {
  const textToModerate =
    req.body.body || req.body.comment || req.body.content || req.body.text;

  if (!textToModerate) {
    return next();
  }

  // Evaluates text against the local dictionary synchronously
  const isFlagged = leoProfanity.check(textToModerate);

  if (isFlagged) {
    res.status(400);
    throw new Error(
      "Content rejected. Violates community guidelines regarding profanity.",
    );
  }

  next();
});
