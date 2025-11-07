const express = require('express');
const { Product } = require('../db');
const router = express.Router();

// ✅ GET /api/products?page=1&limit=6
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Step 1: Count total products
    const totalProducts = await Product.countDocuments();

    // Step 2: Fetch paginated products
    const products = await Product.find()
      .select('name price image')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      page,
      limit,
      totalProducts,
      totalPages,
      products: products.map(p => ({ id: p._id, title: p.name, price: p.price, image: p.image })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
