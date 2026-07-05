const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const ProductCategory = require('../models/ProductCategory');
const Box = require('../models/Box');
const Slider = require('../models/Slider');
const Term = require('../models/Term');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all product categories
router.get('/product-categories', async (req, res) => {
  try {
    const pCategories = await ProductCategory.find({});
    res.json(pCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get boxes sections
router.get('/boxes', async (req, res) => {
  try {
    const boxes = await Box.find({});
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sliders
router.get('/sliders', async (req, res) => {
  try {
    const sliders = await Slider.find({});
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get terms
router.get('/terms', async (req, res) => {
  try {
    const terms = await Term.find({});
    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
