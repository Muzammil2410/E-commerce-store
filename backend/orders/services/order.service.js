/**
 * Order service - createOrder, getOrdersByBuyer, getOrdersBySeller
 * Business logic only.
 */
const Order = require('../models/order.model');
const Product = require('../../products/models/product.model');

/**
 * Normalize order for API response (id, orderItems with product snapshot, address, user for buyer)
 */
function toOrderResponse(orderDoc, buyerPopulate = false) {
  const order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
  order.id = order._id.toString();
  delete order._id;
  if (order.buyer && order.buyer._id) {
    order.userId = order.buyer._id.toString();
    if (buyerPopulate && order.buyer.name) {
      order.user = {
        id: order.buyer._id.toString(),
        name: order.buyer.name,
        email: order.buyer.email,
      };
    }
    delete order.buyer;
  }
  if (order.shippingAddress) {
    order.address = {
      name: order.shippingAddress.name,
      email: order.shippingAddress.email,
      phone: order.shippingAddress.phone,
      street: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zip: order.shippingAddress.zip,
      country: order.shippingAddress.country,
    };
  }
  order.total = order.totalAmount;
  order.status = (order.status || 'pending').toUpperCase();
  order.expectedDeliveryDate = order.expectedDeliveryDate || null;
  order.orderItems = (order.items || []).map((item) => ({
    productId: item.productId && item.productId._id ? item.productId._id.toString() : item.productId,
    sellerId: item.sellerId,
    price: item.price,
    quantity: item.quantity,
    product: item.product
      ? {
          id: item.product._id ? item.product._id.toString() : item.product.id,
          name: item.product.title || item.product.name,
          images: item.product.images || [],
          category: item.product.category || '',
          price: item.product.price,
        }
      : undefined,
  }));
  delete order.items;
  delete order.totalAmount;
  return order;
}

/**
 * Create order (buyer only).
 * sellerId for each item is taken from the product in DB, never from frontend.
 * @param {Object} orderData - { items: [{ productId, price, quantity }], shippingAddress, totalAmount }
 * @param {string} buyerId - User id from JWT
 */
async function createOrder(orderData, buyerId) {
  const { items, shippingAddress, totalAmount } = orderData;
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must have at least one item');
  }
  if (!shippingAddress || !shippingAddress.name || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip || !shippingAddress.country) {
    throw new Error('Valid shipping address is required');
  }
  if (totalAmount == null || totalAmount < 0) {
    throw new Error('Valid total amount is required');
  }

  // Resolve products from DB so we can set sellerId from DB (never trust frontend)
  const productIds = [...new Set(items.map((i) => i.productId).filter(Boolean))];
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p;
  });

  const orderItems = items.map((i) => {
    const productId = i.productId;
    const product = productMap[productId && productId.toString ? productId.toString() : productId];
    const sellerIdFromDb = product && product.sellerId != null ? String(product.sellerId) : null;
    const item = {
      productId,
      sellerId: sellerIdFromDb,
      price: Number(i.price),
      quantity: Number(i.quantity) || 1,
    };
    console.log('[Orders] createOrder item', { productId: String(productId), productSellerId: product?.sellerId, savedItemSellerId: item.sellerId });
    return item;
  });

  const order = await Order.create({
    buyer: buyerId,
    items: orderItems,
    shippingAddress: {
      name: shippingAddress.name,
      email: shippingAddress.email || '',
      phone: shippingAddress.phone || '',
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state || '',
      zip: shippingAddress.zip,
      country: shippingAddress.country,
    },
    totalAmount: Number(totalAmount),
    status: 'confirmed',
    paymentStatus: 'pending',
  });

  console.log('[Orders] Order created', { orderId: order._id.toString(), buyerId, itemCount: orderItems.length });
  return order;
}

/**
 * Get orders for buyer (own orders only)
 */
async function getOrdersByBuyer(buyerId) {
  const orders = await Order.find({ buyer: buyerId })
    .sort({ createdAt: -1 })
    .lean();

  const productIds = new Set();
  orders.forEach((o) => (o.items || []).forEach((i) => i.productId && productIds.add(i.productId.toString())));
  const products = await Product.find({ _id: { $in: Array.from(productIds) } }).lean();
  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p;
  });

  const withProducts = orders.map((o) => {
    const items = (o.items || []).map((i) => ({
      ...i,
      product: productMap[i.productId && i.productId.toString ? i.productId.toString() : i.productId],
    }));
    return { ...o, items };
  });

  console.log('[Orders] getOrdersByBuyer', { buyerId, count: withProducts.length });
  return withProducts.map((o) => toOrderResponse(o, false));
}

/**
 * Get orders that contain at least one item from this seller.
 * Returns only seller-specific items per order (other sellers' items are filtered out).
 */
async function getOrdersBySeller(sellerId) {
  const sellerIdStr = String(sellerId);
  const orders = await Order.find({ 'items.sellerId': sellerIdStr })
    .sort({ createdAt: -1 })
    .populate('buyer', 'name email')
    .lean();

  const productIds = new Set();
  orders.forEach((o) => (o.items || []).forEach((i) => i.productId && productIds.add(i.productId.toString())));
  const products = await Product.find({ _id: { $in: Array.from(productIds) } }).lean();
  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p;
  });

  // Attach product to each item, then filter items to only this seller's
  const withProducts = orders.map((o) => {
    const allItems = (o.items || []).map((i) => ({
      ...i,
      product: productMap[i.productId && i.productId.toString ? i.productId.toString() : i.productId],
    }));
    const itemsBefore = allItems.length;
    const items = allItems.filter((i) => String(i.sellerId) === sellerIdStr);
    if (itemsBefore !== items.length) {
      console.log('[Orders] getOrdersBySeller filter', { orderId: o._id.toString(), itemsBefore, itemsAfter: items.length });
    }
    return { ...o, items };
  });

  const totalOrders = withProducts.length;
  const totalItems = withProducts.reduce((sum, o) => sum + (o.items || []).length, 0);
  console.log('[Orders] getOrdersBySeller', { sellerId: sellerIdStr, count: totalOrders, totalSellerItems: totalItems });
  return withProducts.map((o) => toOrderResponse(o, true));
}

module.exports = {
  createOrder,
  getOrdersByBuyer,
  getOrdersBySeller,
};
