import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Step up one directory from /utils to find the models folder
import Company from '../models/Company.js';

// 1. ES Module workaround to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Explicitly tell dotenv to look one folder up (in the server root)
dotenv.config({ path: path.join(__dirname, '../.env') });

const runMigration = async () => {
  try {
    // 3. Safety check to ensure the URI loaded correctly
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing! Check your .env file location.");
    }

    console.log('Connecting to the database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    console.log('Running migration: Approving all existing companies...');

    // Update all companies that either don't have the field, or where it is false
    const result = await Company.updateMany(
      { isApproved: { $ne: true } },
      { $set: { isApproved: true } }
    );

    console.log(`Migration complete! Updated ${result.modifiedCount} companies.`);

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
