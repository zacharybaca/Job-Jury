
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js"; // We'll fill this utility next
import asyncHandler from "express-async-handler";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  const userNameExists = await User.findOne({ username });

  if (userExists || userNameExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id); // Generate JWT and set cookie
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const user = await User.findOne({ email }) || await User.findOne({ username });

  // Check if user exists AND password matches (method defined in Model)
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); // Generate JWT and set cookie
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie by setting it to expire immediately
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

export { registerUser, loginUser, logoutUser };
