const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST: Create a new product with images
router.post('/', upload.array('images', 8), async (req, res) => {
    try {
        const {
            title, sku, category, brand, price, salePrice, stockQuantity,
            weight, dimensions, videoUrl, shortDescription, description,
            metaTitle, metaDescription, keywords, status
        } = req.body;

        // Process images
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

        // Parse dimensions if sent as string (JSON)
        let parsedDimensions = dimensions;
        if (typeof dimensions === 'string') {
            try {
                parsedDimensions = JSON.parse(dimensions);
            } catch (e) {
                console.error("Error parsing dimensions", e);
            }
        }

        const newProduct = new Product({
            title,
            sku,
            category,
            brand,
            price,
            salePrice,
            stockQuantity,
            weight,
            dimensions: parsedDimensions,
            images: imagePaths,
            videoUrl,
            shortDescription,
            description,
            metaTitle,
            metaDescription,
            keywords,
            status: status || 'published'
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// GET: Fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        // Map products to include full URL for images if needed, 
        // but frontend can handle relative paths if base URL is set.
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

module.exports = router;
