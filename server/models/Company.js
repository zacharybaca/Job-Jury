import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    // Essential for Cloudinary cleanup
    imagePublicId: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true },
);

/**
 * PRE-DELETE MIDDLEWARE
 * Triggers on company.deleteOne()
 * Handles both Cloudinary asset removal and Review cascade deletion.
 */

companySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const companyId = this._id;

      // 1. Cleanup Cloudinary Image
      if (this.imagePublicId) {
        await cloudinary.uploader.destroy(this.imagePublicId);
        console.log(`✅ Cloudinary image removed: ${this.imagePublicId}`);
      }

      // 2. Cascade Delete Reviews
      // We access the Review model via mongoose to avoid circular dependency errors
      const Review = mongoose.model("Review");
      const deleteResult = await Review.deleteMany({ company: companyId });

      console.log(
        `✅ Cascade delete: Removed ${deleteResult.deletedCount} reviews for company ${this.name}`,
      );

      next();
    } catch (error) {
      console.error("❌ Middleware Cleanup Error:", error);
      // We call next() anyway so the primary record is still deleted
      next();
    }
  },
);

const Company = mongoose.model("Company", companySchema);
export default Company;
