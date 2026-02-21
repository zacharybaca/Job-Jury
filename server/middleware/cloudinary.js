// 1. Change require to import
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job_jury_assets",
    allowedFormats: ["jpeg", "png", "jpg", "mp4"],
    resource_type: "auto",
  },
});

// 2. Create the upload middleware
export const upload = multer({ storage });

// 3. Export cloudinary if needed elsewhere
export { cloudinary };
