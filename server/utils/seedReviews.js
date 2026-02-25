import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Company from "../models/Company.js";
import Review from "../models/Review.js";

// 1. Setup paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Resolve the path to the .env file
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Review Seeding...");

    // Clear existing reviews to prevent duplicates
    await Review.deleteMany({});
    console.log("Old review data cleared.");

    // Fetch the companies we just seeded to get their real IDs
    const companies = await Company.find({});

    if (companies.length === 0) {
      console.error("❌ No companies found. Seed companies first!");
      process.exit(1);
    }

    const mockReviews = [];

    // Helper to find a company by name from the fetched list
    const getCoId = (name) => companies.find((c) => c.name === name)?._id;

    // 3. Define Mock Reviews for your specific companies
    const reviewsData = [
      {
        company: getCoId("Surf Internet"),
        title: "Great culture and fast growth",
        body: "Working at Surf has been a blast. The engineering team is sharp and the fiber rollout is exciting.",
        rating: 5,
        salary: 85000,
        jobTitle: "Software Engineer",
        isAnonymous: false,
      },
      {
        company: getCoId("Surf Internet"),
        title: "Fast paced but rewarding",
        body: "Sometimes the deadlines are tight, but the management actually listens to feedback.",
        rating: 4,
        salary: 55000,
        jobTitle: "Customer Support",
        isAnonymous: true,
      },
      {
        company: getCoId("Tech Solutions"),
        title: "Standard corporate vibes",
        body: "The tech stack is a bit dated, but the work-life balance is decent for a dev role.",
        rating: 3,
        salary: 95000,
        jobTitle: "Full Stack Developer",
        isAnonymous: true,
      },
      {
        company: getCoId("Global Logistics"),
        title: "High stress, low pay",
        body: "Expect long hours and constant tracking. Not a great environment for long-term growth.",
        rating: 2,
        salary: 45000,
        jobTitle: "Logistics Coordinator",
        isAnonymous: true,
      },
    ];

    // Filter out any reviews where the company wasn't found
    const validReviews = reviewsData.filter((r) => r.company);

    await Review.insertMany(validReviews);

    // 4. Update the Company models with the review IDs
    // This is necessary if your Company schema stores an array of review ObjectIds
    for (const review of await Review.find({})) {
      await Company.findByIdAndUpdate(review.company, {
        $push: { reviews: review._id },
      });
    }

    console.log(
      `🚀 ${validReviews.length} verdicts have been recorded by the Jury!`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during review seeding:", error.message);
    process.exit(1);
  }
};

seedReviews();
