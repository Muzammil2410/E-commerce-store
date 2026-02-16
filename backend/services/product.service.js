/**
 * Product service - business logic only
 * - createProduct: upload images to Cloudinary, save product with secure_url
 * - getAllProducts: fetch all from DB
 */
const cloudinary = require('../config/cloudinary');
const Product = require('../models/product.model');

/**
 * Upload a single file buffer to Cloudinary
 * @param {Buffer} buffer - file buffer from multer
 * @param {string} folder - optional folder name in Cloudinary
 * @returns {Promise<string>} secure_url
 */
async function uploadToCloudinary(buffer, folder = 'products') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        console.log('Cloudinary upload success:', result.secure_url);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Create product: upload images to Cloudinary, then save to DB
 * @param {Object} data - product fields from req.body
 * @param {Array} files - multer files (buffer in memory)
 * @returns {Promise<Object>} saved product
 */
async function createProduct(data, files = []) {
  const imageUrls = [];

  for (const file of files) {
    if (file.buffer) {
      const url = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
    }
  }

  const num = (v) => (v === '' || v == null ? undefined : Number(v));
  let dimensions = data.dimensions;
  if (typeof dimensions === 'string') {
    try {
      dimensions = JSON.parse(dimensions);
    } catch (e) {
      console.error('Error parsing dimensions', e);
      dimensions = undefined;
    }
  }

  const product = new Product({
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
  console.log('Product saved:', { id: saved._id, title: saved.title, imagesCount: saved.images.length });
  return saved;
}

/**
 * Get all products (newest first)
 */
async function getAllProducts() {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  console.log('Products fetched:', products.length);
  return products;
}

module.exports = {
  createProduct,
  getAllProducts,
  uploadToCloudinary,
};
