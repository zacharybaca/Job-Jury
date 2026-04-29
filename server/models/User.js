import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    // UPDATE 1: Renamed to match the controller
    avatarPublicId: { type: String, default: "" },
    savedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isSuspended: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    subscriptionTier: {
      type: String,
      enum: ["free", "juror", "judge", "firm"],
      default: "free",
    },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    notificationsEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Update subscription tier before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("subscriptionTier")) {
    return next();
  }
  const tier = this.subscriptionTier;
  this.isPremium = tier === "juror" || tier === "judge" || tier === "firm";
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a raw 20-character hex token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash the token and set it to the database field
  // We hash it in the DB so if your database is ever compromised, hackers can't use the tokens
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiration to 10 minutes from right now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Return the RAW token (this is what we email to the user)
  return resetToken;
};

/**
 * PRE-DELETE MIDDLEWARE
 * Triggers on user.deleteOne()
 * Handles Cloudinary asset removal, Review cascade deletion, and Pending Company cleanup.
 */
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const userId = this._id;

      // 1. Cleanup Cloudinary Image
      if (this.avatarPublicId) {
        await cloudinary.uploader.destroy(this.avatarPublicId);
        console.log(`✅ Cloudinary avatar removed: ${this.avatarPublicId}`);
      }

      // 2. Cascade Delete Reviews
      // Make sure '{ author: userId }' matches the field name in your Review model!
      const Review = mongoose.model("Review");
      const deletedReviews = await Review.deleteMany({ author: userId });
      console.log(
        `✅ Cascade delete: Removed ${deletedReviews.deletedCount} reviews for user ${this.username}`,
      );

      // 3. NEW: Cleanup Pending Company Submissions
      const Company = mongoose.model("Company");
      const deletedCompanies = await Company.deleteMany({
        createdBy: userId,
        isApproved: false, // Only delete if it hasn't been approved yet
      });
      console.log(
        `✅ Cascade delete: Removed ${deletedCompanies.deletedCount} pending companies for user ${this.username}`,
      );

      next();
    } catch (error) {
      console.error("❌ Middleware Cleanup Error:", error);
      // We call next() anyway so the primary user record is still deleted
      next();
    }
  },
);

const User = mongoose.model("User", userSchema);

export default User;
