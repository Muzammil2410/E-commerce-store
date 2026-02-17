/**
 * Product routes - NO auth middleware
 * POST /api/products - seller add product (images → Cloudinary)
 * GET /api/products - buyer fetch products
 */
const express = require('express');
const multer = require('multer');
const productService = require('../services/product.service');

const router = express.Router();

// Debug middleware: Log all requests to product routes
router.use((req, res, next) => {
  console.log(`[Product Routes] ${req.method} ${req.path} - Full URL: ${req.originalUrl || req.url}`);
  next();
});

// Multer memory storage (so we can send buffer to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

// POST /api/products - create product, upload images to Cloudinary
router.post('/', upload.array('images', 8), async (req, res) => {
  try {
    console.log('Received product creation request, files:', req.files?.length ?? 0);
    const saved = await productService.createProduct(req.body, req.files || []);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// GET /api/products - fetch all products for buyer shop
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET /api/products/:id - fetch single product detail
// IMPORTANT: This route MUST come AFTER router.get('/') to avoid conflicts
// Express matches routes in order, so exact match '/' comes before parameterized '/:id'
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('✅ Route handler executed: GET /api/products/:id');
    console.log('Product ID from params:', id);
    console.log('Request path:', req.path);
    console.log('Request originalUrl:', req.originalUrl);
    
    // Validate ID format (MongoDB ObjectId is 24 hex characters)
    if (!id || typeof id !== 'string' || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('❌ Invalid product ID format:', id);
      return res.status(400).json({ 
        message: 'Invalid product ID format', 
        productId: id,
        expectedFormat: '24-character MongoDB ObjectId'
      });
    }
    
    console.log('📦 Calling service.getProductById with ID:', id);
    const product = await productService.getProductById(id);
    
    if (!product) {
      console.error('❌ Product not found in database for ID:', id);
      return res.status(404).json({ 
        message: 'Product not found', 
        productId: id 
      });
    }
    
    console.log('✅ Product detail fetched successfully:', {
      id: product._id,
      title: product.title,
      imagesCount: product.images?.length || 0
    });
    
    res.status(200).json(product);
  } catch (error) {
    console.error('❌ Error in route handler:', error);
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
});

// Debug: Log all registered routes
console.log('Product routes registered:');
console.log('  POST /api/products');
console.log('  GET /api/products');
console.log('  GET /api/products/:id');

module.exports = router;
