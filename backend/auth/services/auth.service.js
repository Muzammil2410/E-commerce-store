/**
 * Auth service - register, login, JWT generation
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const SALT_ROUNDS = 10;

/**
 * Hardcoded admin credentials (DO NOT change - per requirements)
 * Used for admin login only; returns JWT like other roles.
 */
const ADMIN_CREDENTIALS = [
  { email: 'admin@zizla.com', password: 'admin123', name: 'Admin User' },
  { email: 'admin@company.com', password: 'admin123', name: 'Admin User' },
];

/**
 * Register a new user (seller, buyer, or employee)
 * @param {Object} data - { name, email, password, role, businessName? }
 * @returns {Object} - { user, token }
 */
async function registerUser(data) {
  const { name, email, password, role, businessName } = data;

  if (!name || !email || !password || !role) {
    throw new Error('Name, email, password and role are required');
  }

  const allowedRoles = ['seller', 'buyer', 'employee'];
  if (!allowedRoles.includes(role)) {
    throw new Error('Invalid role for registration');
  }

  // Business name is required for sellers
  if (role === 'seller' && (!businessName || !businessName.trim())) {
    throw new Error('Business name is required for sellers');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const userData = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
  };

  // Add businessName for sellers
  if (role === 'seller' && businessName) {
    userData.businessName = businessName.trim();
  }

  const user = await User.create(userData);

  const token = generateJWT(user);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
}

/**
 * Login user (seller, buyer, employee) or hardcoded admin
 * @param {Object} data - { email, password, role? }
 * @returns {Object} - { user, token }
 */
async function loginUser(data) {
  const { email, password, role: requestedRole } = data;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1) Check hardcoded admin credentials first
  for (const admin of ADMIN_CREDENTIALS) {
    if (admin.email === normalizedEmail && admin.password === password) {
      const adminUser = {
        id: 'admin_hardcoded',
        name: admin.name,
        email: admin.email,
        role: 'admin',
      };
      const token = jwt.sign(
        { id: adminUser.id, email: adminUser.email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
      return { user: adminUser, token };
    }
  }

  // 2) Find user in database
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid email or password');
  }

  if (requestedRole && user.role !== requestedRole) {
    throw new Error('Invalid role for this account');
  }

  const token = generateJWT(user);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
}

/**
 * Generate JWT for a user document or user object with _id/id, email, role
 * @param {Object} user - Mongoose document or { _id/id, email, role }
 * @returns {string} JWT
 */
function generateJWT(user) {
  const id = user._id ? user._id.toString() : user.id;
  const payload = {
    id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

module.exports = {
  registerUser,
  loginUser,
  generateJWT,
};
