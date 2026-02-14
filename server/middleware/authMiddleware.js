
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // We need to create this model next!
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the "jwt" cookie exists
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user but exclude the password field
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Move to the next middleware/controller
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
