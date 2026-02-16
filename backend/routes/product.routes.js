/**
 * Product routes - NO auth middleware
 * POST /api/products - seller add product (images → Cloudinary)
 * GET /api/products - buyer fetch products
 */
const express = require('express');
const multer = require('multer');
const productService = require('../services/product.service');

const router = express.Router();

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

module.exports = router;
