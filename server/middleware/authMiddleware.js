import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.userId).select("-password");

      if (req.user) {
        return next();
      }

      // If token is valid but user was deleted from DB
      if (req.originalUrl !== "/api/users/me") {
        res.status(401);
        throw new Error("User not found");
      }
    } catch (error) {
      if (req.originalUrl !== "/api/users/me") {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  }

  // SOFT-FAIL for the /me endpoint only
  if (req.originalUrl === "/api/users/me") {
    req.user = null;
    return next();
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

const requireTier = (minTier) => (req, res, next) => {
  // 1. Safety Check: If protect failed or was skipped, req.user won't exist
  if (!req.user) {
    res.status(401);
    throw new Error("Authentication required. Please log in.");
  }

  const tiers = ["free", "juror", "judge", "firm"];

  // 2. Default to 'free' if subscriptionTier is somehow missing
  const userTier = req.user.subscriptionTier || "free";
  const userTierIndex = tiers.indexOf(userTier);
  const requiredTierIndex = tiers.indexOf(minTier);

  if (userTierIndex >= requiredTierIndex) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: `The ${minTier} tier is required to access this intelligence.`,
    });
  }
};

export { protect, admin, requireTier };
