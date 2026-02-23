/**
 * Product service - business logic only
 */
const cloudinary = require('../../config/cloudinary');
const Product = require('../models/product.model');

async function uploadToCloudinary(buffer, folder = 'products') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function createProduct(data, files = []) {
  const imageUrls = [];
  for (const file of files) {
    if (file.buffer) imageUrls.push(await uploadToCloudinary(file.buffer));
  }
  const num = (v) => (v === '' || v == null ? undefined : Number(v));
  let dimensions = data.dimensions;
  if (typeof dimensions === 'string') {
    try { dimensions = JSON.parse(dimensions); } catch (e) { dimensions = undefined; }
  }
  const product = new Product({
    sellerId: data.sellerId || undefined,
    title: data.title,
    sku: data.sku || undefined,
    category: data.category,
    brand: data.brand || undefined,
    price: num(data.price),
    salePrice: num(data.salePrice),
    stockQuantity: num(data.stockQuantity),
    skuBarcode: data.skuBarcode || undefined,
    weight: num(data.weight),
    dimensions,
    images: imageUrls,
    videoUrl: data.videoUrl || undefined,
    shortDescription: data.shortDescription,
    description: data.description,
    metaTitle: data.metaTitle || undefined,
    metaDescription: data.metaDescription || undefined,
    keywords: data.keywords || undefined,
    status: data.status || 'published',
  });
  const saved = await product.save();
  return saved;
}

async function getAllProducts() {
  return Product.find().sort({ createdAt: -1 }).lean();
}

async function getProductsBySeller(sellerId) {
  if (!sellerId) return [];
  return Product.find({ sellerId: String(sellerId) }).sort({ createdAt: -1 }).lean();
}

async function getProductById(productId) {
  if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) return null;
  try {
    return await Product.findById(productId).lean();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductsBySeller,
  getProductById,
  uploadToCloudinary,
};
