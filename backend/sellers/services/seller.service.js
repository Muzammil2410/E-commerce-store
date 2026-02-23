/**
 * Seller service - public seller profile and products
 */
const User = require('../../auth/models/user.model');
const Product = require('../../products/models/product.model');

/**
 * Get seller public profile by ID
 * @param {string} sellerId - Seller user ID
 * @returns {Object|null} - Seller public profile or null if not found
 */
async function getSellerProfile(sellerId) {
  if (!sellerId || !sellerId.match(/^[0-9a-fA-F]{24}$/)) {
    return null;
  }

  const seller = await User.findById(sellerId).lean();
  if (!seller || seller.role !== 'seller') {
    return null;
  }

  // Count published products
  const totalProducts = await Product.countDocuments({
    sellerId: String(sellerId),
    status: 'published',
  });

  return {
    id: seller._id.toString(),
    businessName: seller.businessName || seller.name,
    avatarUrl: seller.avatarUrl || null,
    totalProducts,
  };
}

/**
 * Get seller's published products
 * @param {string} sellerId - Seller user ID
 * @param {string} status - Product status filter (default: 'published')
 * @returns {Array} - Array of products
 */
async function getSellerProducts(sellerId, status = 'published') {
  if (!sellerId || !sellerId.match(/^[0-9a-fA-F]{24}$/)) {
    return [];
  }

  // Verify seller exists and is a seller
  const seller = await User.findById(sellerId).lean();
  if (!seller || seller.role !== 'seller') {
    return [];
  }

  const query = { sellerId: String(sellerId) };
  if (status) {
    query.status = status;
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .select('title price images shortDescription createdAt status')
    .lean();

  return products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    price: product.price,
    thumbnailUrl: product.images && product.images.length > 0 ? product.images[0] : null,
    shortDescription: product.shortDescription || '',
    createdAt: product.createdAt,
  }));
}

module.exports = {
  getSellerProfile,
  getSellerProducts,
};

