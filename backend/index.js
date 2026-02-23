// Load .env from backend folder (works even when run from project root)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./products/routes/product.routes');
const authRoutes = require('./auth/routes/auth.routes');
const orderRoutes = require('./orders/routes/order.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth API - register, login (seller/buyer/employee + hardcoded admin)
app.use('/api/auth', authRoutes);

// Order API - JWT + role-based (buyer: create, my; seller: seller)
app.use('/api/orders', orderRoutes);

// Product API (no auth middleware) - MUST be registered before catch-all
app.use('/api/products', productRoutes);

// Debug: Log registered routes
console.log('✅ Auth routes mounted at /api/auth');
console.log('  POST   /api/auth/register');
console.log('  POST   /api/auth/login');
console.log('✅ Order routes mounted at /api/orders');
console.log('  POST   /api/orders (buyer)');
console.log('  GET    /api/orders/my (buyer)');
console.log('  GET    /api/orders/seller (seller)');
console.log('✅ Product routes mounted at /api/products');
console.log('Available routes:');
console.log('  POST   /api/products');
console.log('  GET    /api/products');
console.log('  GET    /api/products/:id');

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect MongoDB first, then start server (avoids 500 on first GET /api/products)
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
