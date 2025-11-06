const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/checkout - Mock checkout
router.post('/', (req, res) => {
  const { cartItems } = req.body;
  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: 'cartItems array is required' });
  }

  // Calculate total
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });

  // Mock receipt
  const receipt = {
    total: total.toFixed(2),
    timestamp: new Date().toISOString(),
    items: cartItems
  };

  // Clear cart after checkout (optional)
  db.run("DELETE FROM cart", [], (err) => {
    if (err) {
      console.error('Error clearing cart:', err.message);
    }
  });

  res.json(receipt);
});

module.exports = router;
