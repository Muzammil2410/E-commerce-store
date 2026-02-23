/**
 * Quick test script to verify route registration
 * Run: node test-route.js
 */
const productRoutes = require('./products/routes/product.routes');

console.log('✅ Route file loaded successfully');
console.log('Route module type:', typeof productRoutes);
console.log('Route module:', productRoutes);

// Check if router has the get method
if (productRoutes && typeof productRoutes === 'function') {
  console.log('✅ Router is a function (Express Router)');
} else {
  console.error('❌ Router is not a function');
}
