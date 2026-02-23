const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: String, required: false }, // User id of seller who created the product (set from auth on create)
    title: { type: String, required: true },
    sku: { type: String },
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stockQuantity: { type: Number, required: true },
    skuBarcode: { type: String },
    weight: { type: Number },
    dimensions: { length: Number, width: Number, height: Number },
    images: [{ type: String }],
    videoUrl: { type: String },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
