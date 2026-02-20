import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

const mockCompanies = [
  {
    name: "Surf Internet",
    industry: "Telecommunications",
    location: "La Porte, IN",
    description: "A leading fiber-optic internet service provider.",
    averageRating: 4.5,
    imageUrl: "https://example.com/surf-internet.png"
  },
  // Add your other hardcoded companies here...
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Optional: Clear existing data so you don't get duplicates
    await Company.deleteMany({});
    console.log("Existing companies cleared.");

    await Company.insertMany(mockCompanies);
    console.log("Database seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
