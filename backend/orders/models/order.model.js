/**
 * Order model - buyer, items (productId, sellerId, price, quantity), shipping, total, status
 */
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: String, required: false }, // User id of seller; optional if product has no seller
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered'],
      default: 'pending',
    },
    paymentStatus: { type: String, default: 'pending' },
    expectedDeliveryDate: { type: Date, required: false },
  },
  { timestamps: true }
);

orderSchema.index({ buyer: 1 });
orderSchema.index({ 'items.sellerId': 1 });

module.exports = mongoose.model('Order', orderSchema);
