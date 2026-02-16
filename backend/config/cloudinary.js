/**
 * Cloudinary configuration
 * Uses dotenv - ensure dotenv.config() is called in index.js before this is required
 * NO hardcoded keys - all from process.env
 */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
