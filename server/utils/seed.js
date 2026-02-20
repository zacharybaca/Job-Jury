import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Company from './models/Company.js';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to the .env file in the server directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

const mockCompanies = [
  {
    name: "Surf Internet",
    industry: "Telecommunications",
    location: "La Porte, IN",
    description: "A leading fiber-optic internet service provider focused on high-speed connectivity.",
    averageRating: 4.8,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    name: "Tech Solutions",
    industry: "Software Engineering",
    location: "Chicago, IL",
    description: "Full-service software development firm specializing in cloud architecture and SaaS.",
    averageRating: 3.5,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    name: "Medi-Care Group",
    industry: "Healthcare",
    location: "Michigan City, IN",
    description: "A regional healthcare provider focused on patient-centered clinical excellence.",
    averageRating: 4.2,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    name: "Global Logistics",
    industry: "Supply Chain",
    location: "Indianapolis, IN",
    description: "Global shipping and supply chain management experts with a vast transit network.",
    averageRating: 2.9,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is undefined. Check the path to your .env file.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Clear existing data to prevent duplicates during testing
    await Company.deleteMany({});
    console.log("Old company data cleared.");

    // Insert the mock data
    await Company.insertMany(mockCompanies);
    console.log(`${mockCompanies.length} companies have been added to the Jury's records!`);

    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error.message);
    process.exit(1);
  }
};

seedDB();
