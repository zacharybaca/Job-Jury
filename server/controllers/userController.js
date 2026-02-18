import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Find user and populate the savedCompanies array with actual company data
  const user = await User.findById(req.user._id).populate("savedCompanies");

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      savedCompanies: user.savedCompanies,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // The pre-save hook in your model will handle hashing if the password is changed
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Save/Unsave a company
// @route   POST /api/users/save/:companyId
// @access  Private
const toggleSaveCompany = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { companyId } = req.params;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if company is already saved
  const isSaved = user.savedCompanies.includes(companyId);

  if (isSaved) {
    // Remove if already exists
    user.savedCompanies = user.savedCompanies.filter(
      (id) => id.toString() !== companyId,
    );
  } else {
    // Add if it doesn't exist
    user.savedCompanies.push(companyId);
  }

  await user.save();
  res.status(200).json({
    success: true,
    message: isSaved ? "Company removed from saves" : "Company saved",
    savedCompanies: user.savedCompanies,
  });
});

export { getUserProfile, updateUserProfile, toggleSaveCompany };
