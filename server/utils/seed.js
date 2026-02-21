import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Company from "../models/Company.js";

// 1. Setup paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Resolve the path to the .env file (stepping up from /utils to /server)
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

// 3. Mock Data
const mockCompanies = [
  {
    name: "Surf Internet",
    industry: "Telecommunications",
    location: "La Porte, IN",
    description:
      "A leading fiber-optic internet service provider focused on high-speed connectivity.",
    averageRating: 4.8,
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Tech Solutions",
    industry: "Software Engineering",
    location: "Chicago, IL",
    description:
      "Full-service software development firm specializing in cloud architecture and SaaS.",
    averageRating: 3.5,
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Medi-Care Group",
    industry: "Healthcare",
    location: "Michigan City, IN",
    description:
      "A regional healthcare provider focused on patient-centered clinical excellence.",
    averageRating: 4.2,
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Global Logistics",
    industry: "Supply Chain",
    location: "Indianapolis, IN",
    description:
      "Global shipping and supply chain management experts with a vast transit network.",
    averageRating: 2.9,
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
];

const seedDB = async () => {
  try {
    // Debugging logs to verify path resolution
    console.log("------------------------------------------");
    console.log(`Checking for .env at: ${envPath}`);

    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is still undefined.");
      console.log(
        "Available Env Variables:",
        Object.keys(process.env).filter((k) => !k.startsWith("NODE_")),
      );
      process.exit(1);
    }

    console.log("✅ MONGO_URI Found. Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to the JobJury database.");

    // Clear existing data to prevent duplicates
    await Company.deleteMany({});
    console.log("Old company data cleared.");

    // Insert the mock data
    await Company.insertMany(mockCompanies);
    console.log(
      `🚀 ${mockCompanies.length} companies have been added to the Jury's records!`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error.message);
    process.exit(1);
  }
};

seedDB();
