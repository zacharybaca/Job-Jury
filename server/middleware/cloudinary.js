import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Manually call config HERE to be 100% safe
dotenv.config();

console.log("Debug: API Key present?", !!process.env.CLOUDINARY_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job_jury_assets",
    allowedFormats: ["jpeg", "png", "jpg", "mp4"],
    resource_type: "auto",
  },
});

export const upload = multer({ storage });
export { cloudinary };
