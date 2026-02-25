import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      return next(); // Continue if token is valid
    } catch (error) {
      // If token is expired/invalid, clear it and move on as a guest
      res.clearCookie('jwt');
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If you want some routes to be "Guest Friendly",
  // you might create a separate 'optionalProtect' middleware.
  res.status(401);
  throw new Error("Not authorized, no token");
});

export { protect };
