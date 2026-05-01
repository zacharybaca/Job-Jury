import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Inside server/controllers/authController.js

const registerUser = asyncHandler(async (req, res) => {
  // 1. Extract isEmployer from the request body
  const { name, username, email, password, isEmployer } = req.body;

  const userExists = await User.findOne({ email });
  const userNameExists = await User.findOne({ username });

  if (userExists || userNameExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 2. Pass isEmployer into the creation method
  const user = await User.create({
    name,
    username,
    email,
    password,
    isEmployer: isEmployer || false // Default to false if not provided
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      notificationsEnabled: user.notificationsEnabled,
      isEmployer: user.isEmployer, // Return it in the payload
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Alternative way to check if user is admin (used in client/src/contexts/Auth/AuthProvider.jsx)
const isUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({ isAdmin: user.isAdmin, isEmployer: user.isEmployer });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user =
    (await User.findOne({ email })) || (await User.findOne({ username }));

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      notificationsEnabled: user.notificationsEnabled,
      isEmployer: user.isEmployer, // Return it in the payload
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("There is no user registered with that email address.");
  }

  // 1. Get reset token from the method we just wrote
  const resetToken = user.getResetPasswordToken();

  // 2. Save the hashed token and expiration to the database
  // We pass { validateBeforeSave: false } so it doesn't demand a password update right now
  await user.save({ validateBeforeSave: false });

  // 3. Construct the reset URL (points to your React frontend)
  // We use the environment variable so it works locally and on Render
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `
    You are receiving this email because you (or someone else) requested a password reset for your Job Jury account.

    Please click the link below to reset your password. This link will expire in 10 minutes:
    \n\n ${resetUrl}
    \n\nIf you did not request this, please ignore this email and your password will remain unchanged.
  `;

  try {
    // 4. Send the email!
    await sendEmail({
      email: user.email,
      subject: "Job Jury - Password Reset Request",
      message: message,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    // If the email fails to send, we MUST clear the token from the database for security
    console.error("Email sending failed:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent. Please try again later.");
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get the hashed version of the token sent in the URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  // 2. Find the user with this matching token AND ensure it hasn't expired
  // $gt means "Greater Than" - so the expiration time must be greater than right now
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset token.");
  }

  // 3. Set the new password.
  // (Your existing User model pre-save hook will automatically encrypt this before saving!)
  user.password = req.body.password;

  // 4. Clear the reset token fields so they can never be reused
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  isUserAdmin,
  forgotPassword,
  resetPassword,
};
