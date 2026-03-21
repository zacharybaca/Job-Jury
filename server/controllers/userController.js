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
      message: "User profile and associated avatar removed.",
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

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // .select('-password') ensures we don't accidentally send hashed passwords to the frontend
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

// @desc    Make a user an admin
// @route   PATCH /api/users/:id/admin
// @access  Private/Admin
const makeUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("User is already an admin");
  }

  user.isAdmin = true;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
    },
  });
});

// @desc    Remove admin privileges from a user
// @route   PATCH /api/users/:id/demote
// @access  Private/Admin
const demoteUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admins from demoting themselves and locking everyone out
  if (
    user._id.toString() === req.user._id.toString() ||
    user._id.toString() === "699dd79be3893bbe8d1c94d0"
  ) {
    res.status(400);
    throw new Error("You cannot demote yourself or the main admin.");
  }

  user.isAdmin = false;
  const updatedUser = await user.save();

  res.status(200).json({ success: true, data: updatedUser });
});

export {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile, // Export the new function
  toggleSaveCompany,
  getUsers,
  makeUserAdmin,
  demoteUserAdmin,
};
