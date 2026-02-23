/**
 * User model - Single Auth/User collection for all roles
 * Roles: admin | seller | buyer | employee
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don't return password by default
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'seller', 'buyer', 'employee'],
      default: 'buyer',
    },
    businessName: {
      type: String,
      trim: true,
      // Required for sellers, optional for other roles
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster login lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
