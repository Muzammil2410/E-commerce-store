/**
 * Order routes - JWT + role-based
 * POST /api/orders - buyer only
 * GET /api/orders/my - buyer only
 * GET /api/orders/seller - seller only
 */
const express = require('express');
const { verifyToken, roleBasedAccess } = require('../../auth/middleware/auth.middleware');
const orderService = require('../services/order.service');

const router = express.Router();

// All order routes require auth
router.use(verifyToken);

/**
 * POST /api/orders - Create order (buyer only)
 * Body: { items: [{ productId, sellerId?, price, quantity }], shippingAddress: { name, email?, phone?, street, city, state?, zip, country }, totalAmount }
 */
router.post('/', roleBasedAccess(['buyer']), async (req, res) => {
  try {
    const buyerId = req.user.id;
    await orderService.createOrder(req.body, buyerId);
    const orders = await orderService.getOrdersByBuyer(buyerId);
    const created = orders[0];
    if (!created) {
      return res.status(500).json({ message: 'Order created but could not be retrieved' });
    }
    res.status(201).json(created);
  } catch (err) {
    console.log('[Orders] Create failure:', err.message);
    res.status(400).json({ message: err.message || 'Failed to create order' });
  }
});

/**
 * GET /api/orders/my - Buyer's own orders
 */
router.get('/my', roleBasedAccess(['buyer']), async (req, res) => {
  try {
    const buyerId = req.user.id;
    const orders = await orderService.getOrdersByBuyer(buyerId);
    console.log('[Orders] fetch my count:', orders.length, 'buyerId:', buyerId);
    res.status(200).json(orders);
  } catch (err) {
    console.log('[Orders] getOrdersByBuyer failure:', err.message);
    res.status(500).json({ message: err.message || 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/seller - Orders containing seller's items
 */
router.get('/seller', roleBasedAccess(['seller']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await orderService.getOrdersBySeller(sellerId);
    console.log('[Orders] fetch seller count:', orders.length, 'sellerId:', sellerId);
    res.status(200).json(orders);
  } catch (err) {
    console.log('[Orders] getOrdersBySeller failure:', err.message);
    res.status(500).json({ message: err.message || 'Failed to fetch orders' });
  }
});

module.exports = router;
