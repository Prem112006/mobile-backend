const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (supports category filtering, search, pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by category
    if (req.query.cat) {
      query.cat_id = req.query.cat;
    }

    // Filter by search keyword
    if (req.query.search) {
      query.$or = [
        { product_title: { $regex: req.query.search, $options: 'i' } },
        { product_keywords: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('cat_id', 'cat_title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/latest
// @desc    Get latest products for home page
router.get('/latest', async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('cat_id', 'cat_title')
      .limit(8)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:idOrUrl
// @desc    Get product details by URL (slug) or ID
router.get('/:idOrUrl', async (req, res) => {
  try {
    let product;
    // Check if it's a valid Mongoose ObjectId
    if (req.params.idOrUrl.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.idOrUrl).populate('cat_id', 'cat_title');
    } else {
      product = await Product.findOne({ product_url: req.params.idOrUrl }).populate('cat_id', 'cat_title');
    }

    if (product) {
      // Find related products in same category (excluding current)
      const related = await Product.find({
        cat_id: product.cat_id,
        _id: { $ne: product._id }
      }).limit(3);

      res.json({ product, related });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
