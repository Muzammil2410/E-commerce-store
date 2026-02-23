/**
 * Seller routes - public read-only endpoints
 * GET /api/sellers/:sellerId - Get seller public profile
 * GET /api/sellers/:sellerId/products - Get seller's products
 */
const express = require('express');
const sellerService = require('../services/seller.service');

const router = express.Router();

/**
 * GET /api/sellers/:sellerId
 * Returns seller public profile
 */
router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const profile = await sellerService.getSellerProfile(sellerId);

    if (!profile) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ message: 'Error fetching seller profile', error: error.message });
  }
});

/**
 * GET /api/sellers/:sellerId/products
 * Query params: ?status=published (default: published)
 * Returns seller's products
 */
router.get('/:sellerId/products', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status = 'published' } = req.query;

    const products = await sellerService.getSellerProducts(sellerId, status);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Error fetching seller products', error: error.message });
  }
});

module.exports = router;

