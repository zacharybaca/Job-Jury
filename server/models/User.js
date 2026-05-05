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
    avatarPublicId: { type: String, default: "" },
    savedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    isAdmin: { type: Boolean, default: false },
    isEmployer: { type: Boolean, default: false },
    managedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    companyRole: {
      type: String,
      enum: [
        "Human Resources",
        "Public Relations",
        "C-Level Executive",
        "Owner / Founder",
        "Operations Manager",
        "Legal Counsel",
        "General Manager"
      ],
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    verificationDocument: {
      type: String,
      default: null,
    },
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("save", function (next) {
  if (!this.isModified("subscriptionTier")) {
    return next();
  }
  const tier = this.subscriptionTier;
  this.isPremium = tier === "juror" || tier === "judge" || tier === "firm";
  next();
});

userSchema.pre("save", function (next) {
  if (this.isAdmin && this.isEmployer) {
    this.isEmployer = false;
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const userId = this._id;

      if (this.avatarPublicId) {
        await cloudinary.uploader.destroy(this.avatarPublicId);
        console.log(`✅ Cloudinary avatar removed: ${this.avatarPublicId}`);
      }

      const Review = mongoose.model("Review");
      const deletedReviews = await Review.deleteMany({ author: userId });
      console.log(
        `✅ Cascade delete: Removed ${deletedReviews.deletedCount} reviews for user ${this.username}`,
      );

      const Company = mongoose.model("Company");
      const deletedCompanies = await Company.deleteMany({
        createdBy: userId,
        isApproved: false,
      });
      console.log(
        `✅ Cascade delete: Removed ${deletedCompanies.deletedCount} pending companies for user ${this.username}`,
      );

      next();
    } catch (error) {
      console.error("❌ Middleware Cleanup Error:", error);
      next();
    }
  },
);

const User = mongoose.model("User", userSchema);

export default User;
