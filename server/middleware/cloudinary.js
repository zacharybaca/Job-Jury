const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// These values will come from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure how files are stored
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job_jury_assets", // Folder name in Cloudinary
    allowedFormats: ["jpeg", "png", "jpg", "mp4"],
    resource_type: "auto", // Crucial: allows both images AND videos
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
