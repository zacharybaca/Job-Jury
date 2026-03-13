import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    imagePublicId: { type: String, default: "" }, // For Cloudinary cleanup
    savedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * PRE-DELETE MIDDLEWARE
 * Triggers on user.deleteOne()
 * Handles both Cloudinary asset removal and Review cascade deletion.
 */

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const userId = this._id;

      // 1. Cleanup Cloudinary Image
      if (this.imagePublicId) {
        await cloudinary.uploader.destroy(this.imagePublicId);
        console.log(`✅ Cloudinary image removed: ${this.imagePublicId}`);
      }

      // 2. Cascade Delete Reviews
      // We access the Review model via mongoose to avoid circular dependency errors
      const Review = mongoose.model("Review");
      const deleteResult = await Review.deleteMany({ user: userId });

      console.log(
        `✅ Cascade delete: Removed ${deleteResult.deletedCount} reviews for user ${this.name}`,
      );

      next();
    } catch (error) {
      console.error("❌ Middleware Cleanup Error:", error);
      // We call next() anyway so the primary record is still deleted
      next();
    }
  },
);

const User = mongoose.model("User", userSchema);

export default User;
