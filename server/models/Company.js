import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String }, // This is the key for Cloudinary deletion
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
  { timestamps: true }
);

/**
 * PRE-DELETE MIDDLEWARE
 * This function runs automatically before the database record is removed.
 */
companySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    // If an imagePublicId exists, tell Cloudinary to delete it
    if (this.imagePublicId) {
      await cloudinary.uploader.destroy(this.imagePublicId);
      console.log(`✅ Asset ${this.imagePublicId} successfully removed from Cloudinary.`);
    }
    next();
  } catch (error) {
    console.error("❌ Cloudinary Cleanup Error:", error);
    // We call next() anyway so the DB record is still deleted even if Cloudinary fails
    next();
  }
});

const Company = mongoose.model("Company", companySchema);
export default Company;
