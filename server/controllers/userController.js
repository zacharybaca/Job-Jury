import User from "../models/User.js";
import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = asyncHandler(async (req, res) => {
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

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.notificationsEnabled =
      req.body.notificationsEnabled !== undefined
        ? req.body.notificationsEnabled
        : user.notificationsEnabled;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }
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
      notificationsEnabled: updatedUser.notificationsEnabled,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const changeSubscriptionTier = asyncHandler(async (req, res) => {
  const { subscriptionTier } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.subscriptionTier = subscriptionTier || user.subscriptionTier;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      subscriptionTier: updatedUser.subscriptionTier,
      notificationsEnabled: updatedUser.notificationsEnabled,
    },
  });
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }
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

const toggleSaveCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isSaved = user.savedCompanies.some((id) => id.toString() === companyId);
  const update = isSaved
    ? { $pull: { savedCompanies: companyId } }
    : { $addToSet: { savedCompanies: companyId } };

  const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: isSaved ? "Company removed" : "Company saved",
    savedCompanies: updatedUser.savedCompanies,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

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

const demoteUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
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

const toggleWatchlist = asyncHandler(async (req, res) => {
  const { companyId } = req.body;
  const user = await User.findById(req.user._id);

  const index = user.watchlist.indexOf(companyId);
  if (index > -1) {
    user.watchlist.splice(index, 1);
  } else {
    user.watchlist.push(companyId);
  }

  await user.save();
  res.status(200).json({ success: true, watchlist: user.watchlist });
});

const fixCorruptedData = asyncHandler(async (req, res) => {
  await User.updateMany(
    {},
    {
      $set: {
        watchlist: [],
        savedCompanies: [],
      },
    },
  );
  res.send("Database sanitized: All corrupted watchlist strings removed.");
});

const toggleUserSuspension = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (
    user._id.toString() === req.user._id.toString() ||
    user._id.toString() === "699dd79be3893bbe8d1c94d0"
  ) {
    res.status(400);
    throw new Error("You cannot suspend your own account or the main admin.");
  }

  user.isSuspended = !user.isSuspended;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      isSuspended: updatedUser.isSuspended,
    },
  });
});

const createUserAsAdmin = asyncHandler(async (req, res) => {
  const { name, username, email, password, isAdmin } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists with that email or username.");
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    isAdmin: isAdmin || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

const submitCompanyClaim = asyncHandler(async (req, res) => {
  const { companyId, companyRole } = req.body;
  const user = await User.findById(req.user._id);
  const company = await Company.findById(companyId);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const userPrefix = user.email.split("@")[0].toLowerCase();
  const userDomain = user.email.split("@")[1].toLowerCase();
  const authoritativePrefixes = [
    "hr",
    "admin",
    "careers",
    "management",
    "director",
  ];

  let isAutoVerified = false;

  if (company.website) {
    try {
      const companyUrl = new URL(
        company.website.startsWith("http")
          ? company.website
          : `https://${company.website}`,
      );
      const companyDomain = companyUrl.hostname
        .replace("www.", "")
        .toLowerCase();

      if (
        userDomain === companyDomain &&
        authoritativePrefixes.includes(userPrefix)
      ) {
        isAutoVerified = true;
      }
    } catch (error) {
      console.error("Invalid company URL format for parsing");
    }
  }

  user.managedCompany = companyId;
  user.companyRole = companyRole || "Unspecified";

  if (req.file) {
    user.verificationDocument = req.file.path; // Cloudinary URL assigned via Multer
  }

  user.verificationStatus = isAutoVerified ? "verified" : "pending";
  await user.save();

  res.status(200).json({
    success: true,
    verificationStatus: user.verificationStatus,
    managedCompany: user.managedCompany,
    message: isAutoVerified
      ? "Authorization verified. Company claimed successfully."
      : "Claim submitted. Pending administrative review to verify your role.",
  });
});

const getPendingClaims = asyncHandler(async (req, res) => {
  const claims = await User.find({
    verificationStatus: "pending",
    isEmployer: true,
  })
    .populate("managedCompany", "name website location")
    .select(
      "name email username verificationStatus verificationDocument createdAt",
    );

  res.status(200).json({ success: true, data: claims });
});

const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.verificationStatus = status;
  if (status === "rejected") {
    user.managedCompany = null;
  }

  await user.save();
  res.status(200).json({ success: true, data: user });
});

export {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  toggleSaveCompany,
  toggleUserSuspension,
  getUsers,
  makeUserAdmin,
  demoteUserAdmin,
  createUserAsAdmin,
  toggleWatchlist,
  fixCorruptedData,
  changeSubscriptionTier,
  submitCompanyClaim,
  getPendingClaims,
  updateClaimStatus,
};
