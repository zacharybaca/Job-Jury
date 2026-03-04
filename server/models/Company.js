import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    // Store this to make Cloudinary management easy
    imagePublicId: { type: String },
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
 * This runs automatically whenever you call company.deleteOne()
 * in your controller.
 */
companySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    if (this.imagePublicId) {
      await cloudinary.uploader.destroy(this.imagePublicId);
      console.log(`✅ Cloudinary asset ${this.imagePublicId} deleted.`);
    }
    next();
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
    next(error);
  }
});

const Company = mongoose.model("Company", companySchema);
export default Company;
