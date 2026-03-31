import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");

      // If a user was actually found, move to next
      if (req.user) return next();

      // If token was valid but user no longer exists in DB, fall through to soft-fail
    } catch (error) {
      // For any route OTHER than /me, a failed token is a hard 401
      if (req.originalUrl !== "/api/users/me") {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  }

  // SOFT-FAIL: If we are checking auth status (/me), allow the request
  // to continue even if token is missing or invalid. req.user will just be null.
  if (req.originalUrl === "/api/users/me") {
    return next();
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === "admin")) {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error("Not authorized as an admin");
  }
};

export const requireTier = (minTier) => (req, res, next) => {
  const tiers = ['free', 'juror', 'judge', 'firm'];
  const userTierIndex = tiers.indexOf(req.user.subscriptionTier);
  const requiredTierIndex = tiers.indexOf(minTier);

  if (userTierIndex >= requiredTierIndex) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: `This feature requires a ${minTier} subscription.`
    });
  }
};

export { protect, admin, requireTier };
