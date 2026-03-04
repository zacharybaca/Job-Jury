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
  },
  { timestamps: true }
);

// --- STATIC METHOD TO CALCULATE AVERAGE ---
reviewSchema.statics.calculateAverage = async function (companyId) {
  // Use aggregation to find the average of all reviews for this company
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
    if (stats.length > 0) {
      await Company.findByIdAndUpdate(companyId, {
        averageRating: stats[0].avgRating.toFixed(1),
      });
    } else {
      await Company.findByIdAndUpdate(companyId, {
        averageRating: 0,
      });
    }
  } catch (error) {
    console.error("Error updating company average:", error);
  }
};

// --- MIDDLEWARE HOOKS ---

// Call calculateAverage after saving a new review
reviewSchema.post("save", function () {
  this.constructor.calculateAverage(this.company);
});

// Call calculateAverage after deleting a review
// Note: This requires the use of doc.deleteOne() in the controller
reviewSchema.post("deleteOne", { document: true, query: false }, function () {
  this.constructor.calculateAverage(this.company);
});

// --- YOUR EXISTING ANONYMITY HOOKS ---
reviewSchema.post("findOne", function (doc, next) {
  if (doc && doc.isAnonymous && doc.author) {
    doc.author = { username: "Anonymous User" };
  }
  next();
});

reviewSchema.post("find", function (docs, next) {
  docs.forEach((doc) => {
    if (doc.isAnonymous && doc.author) {
      doc.author = { username: "Anonymous User" };
    }
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
