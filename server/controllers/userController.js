import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary"; // Import to handle image deletion

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
      avatar: user.avatar,
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

    // NEW: Handle Cloudinary Avatar Replacement
    if (req.file) {
      // 1. If an old avatar exists, destroy it in Cloudinary to prevent orphaned files
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }
      // 2. Attach the new Cloudinary URLs provided by the Multer middleware
      user.avatar = req.file.path;
      user.avatarPublicId = req.file.filename;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// NEW: Delete User Profile Function
// @desc    Delete user profile and avatar
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 1. Delete the avatar from Cloudinary if they uploaded one
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // 2. Delete the user document from the database
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User profile and associated avatar removed."
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

export {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile, // Export the new function
  toggleSaveCompany
};
