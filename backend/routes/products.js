const express = require('express');
const db = require('../db');
const router = express.Router();

// ✅ GET /api/products?page=1&limit=6
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Step 1: Count total products
  db.get("SELECT COUNT(*) AS total FROM products", [], (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const totalProducts = countResult.total;
    const totalPages = Math.ceil(totalProducts / limit);

    // Step 2: Fetch paginated products
    db.all(
      "SELECT id, name AS title, price, image FROM products LIMIT ? OFFSET ?",
      [limit, offset],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          page,
          limit,
          totalProducts,
          totalPages,
          products: rows,
        });
      }
    );
  });
});

module.exports = router;
