const express = require('express');
const db = require('../db');
const { verifyToken } = require('./auth');
const router = express.Router();

// POST /api/cart - Add item to cart
router.post('/', verifyToken, (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) {
    return res.status(400).json({ error: 'productId and qty are required' });
  }

  db.run("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [req.user.id, productId, qty], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, productId, qty });
  });
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cart WHERE id = ? AND user_id = ?", [id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item removed' });
  });
});

// PUT /api/cart/:id - Update quantity of cart item
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  if (!qty || qty < 1) {
    return res.status(400).json({ error: 'qty must be at least 1' });
  }

  db.run("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [qty, id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Quantity updated' });
  });
});

// GET /api/cart - Get cart items with total
router.get('/', verifyToken, (req, res) => {
  const query = `
    SELECT c.id, c.quantity, p.name, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items: rows, total: total.toFixed(2) });
  });
});

module.exports = router;
