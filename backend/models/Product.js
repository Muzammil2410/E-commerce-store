const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sku: { type: String },
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stockQuantity: { type: Number, required: true },
    weight: { type: Number },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    images: [{ type: String }], // Array of image URLs/paths
    videoUrl: { type: String },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
});

module.exports = mongoose.model('Product', productSchema);
