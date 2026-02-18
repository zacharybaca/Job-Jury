import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    description: String,
    imageUrl: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
