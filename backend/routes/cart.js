const express = require('express');
const { Cart, Product } = require('../db');
const { verifyToken } = require('./auth');
const router = express.Router();

// POST /api/cart - Add item to cart
router.post('/', verifyToken, async (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) {
    return res.status(400).json({ error: 'productId and qty are required' });
  }

  try {
    const cartItem = new Cart({ user_id: req.user.id, product_id: productId, quantity: qty });
    await cartItem.save();
    res.json({ id: cartItem._id, productId, qty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Cart.findOneAndDelete({ _id: id, user_id: req.user.id });
    if (!result) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cart/:id - Update quantity of cart item
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  if (!qty || qty < 1) {
    return res.status(400).json({ error: 'qty must be at least 1' });
  }

  try {
    const result = await Cart.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { quantity: qty },
      { new: true }
    );
    if (!result) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cart - Get cart items with total
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user_id: req.user.id }).populate('product_id', 'name price');
    const items = cartItems.map(item => ({
      id: item._id,
      productId: item.product_id._id,
      quantity: item.quantity,
      name: item.product_id.name,
      price: item.product_id.price
    }));
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items, total: total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
