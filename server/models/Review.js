import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    title: { type: String },
    body: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    salary: { type: Number },
    jobTitle: { type: String },
    isAnonymous: { type: Boolean, default: true },
    markedInappropriate: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// --- STATIC METHOD TO CALCULATE AVERAGE ---
reviewSchema.statics.calculateAverage = async function (companyId) {
  const stats = await this.aggregate([
    { $match: { company: companyId } },
    {
      $group: {
        _id: "$company",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    const Company = mongoose.model("Company");
    // Fix: If no stats (last review deleted), reset to 0; otherwise, parse the fixed float.
    const avg = stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : 0;

    await Company.findByIdAndUpdate(companyId, {
      averageRating: avg,
    });
  } catch (error) {
    console.error("Error updating company average:", error);
  }
};

// --- MIDDLEWARE HOOKS ---

reviewSchema.post("save", function () {
  this.constructor.calculateAverage(this.company);
});

reviewSchema.post("deleteOne", { document: true, query: false }, function () {
  this.constructor.calculateAverage(this.company);
});

reviewSchema.post("findOne", function (doc, next) {
  if (doc && doc.isAnonymous && doc.author) {
    const originalId = doc.author;
    doc.author = {
      username: "Anonymous User",
      _id: originalId,
    };
  }
  next();
});

reviewSchema.post("find", function (docs, next) {
  docs.forEach((doc) => {
    if (doc.isAnonymous && doc.author) {
      const originalId = doc.author._id || doc.author;
      doc.author = {
        username: "Anonymous User",
        _id: originalId,
      };
    }
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
