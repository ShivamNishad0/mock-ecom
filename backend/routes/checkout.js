const express = require('express');
const { Product, Cart } = require('../db');
const router = express.Router();

// POST /api/checkout - Mock checkout
router.post('/', async (req, res) => {
  const { cartItems } = req.body;
  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: 'cartItems array is required' });
  }

  try {
    // Fetch product details to get prices
    const productIds = cartItems.map(item => item.id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Calculate total
    let total = 0;
    const itemsWithPrices = cartItems.map(item => {
      const product = productMap[item.id];
      if (!product) {
        throw new Error(`Product with id ${item.id} not found`);
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      return {
        ...item,
        name: product.name,
        price: product.price,
        total: itemTotal.toFixed(2)
      };
    });

    // Mock receipt
    const receipt = {
      total: total.toFixed(2),
      timestamp: new Date().toISOString(),
      items: itemsWithPrices
    };

    // Clear cart after checkout (optional - clears all carts as mock)
    await Cart.deleteMany({});

    res.json(receipt);
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ error: 'Internal server error during checkout' });
  }
});

module.exports = router;
