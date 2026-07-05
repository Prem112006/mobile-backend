const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Slider = require('../models/Slider');
const Term = require('../models/Term');
const Box = require('../models/Box');
const Coupon = require('../models/Coupon');
const { protectAdmin } = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Admin Auth check: apply protectAdmin middleware to all routes below
router.use(protectAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard metrics
router.get('/dashboard', async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const customersCount = await Customer.countDocuments();

    // Sum earnings
    const completedOrders = await Order.find({ paymentStatus: 'Completed' });
    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.dueAmount, 0);

    const latestOrders = await Order.find({})
      .populate('customerId', 'customers_name customers_email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      productsCount,
      ordersCount,
      customersCount,
      totalEarnings,
      latestOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= PRODUCT CRUD =================

router.post('/products', upload.fields([
  { name: 'img1', maxCount: 1 },
  { name: 'img2', maxCount: 1 },
  { name: 'img3', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, url, price, salePrice, keywords, desc, features, label, categoryId } = req.body;

    const img1 = req.files['img1'] ? req.files['img1'][0].filename : '';
    const img2 = req.files['img2'] ? req.files['img2'][0].filename : '';
    const img3 = req.files['img3'] ? req.files['img3'][0].filename : '';

    const product = await Product.create({
      product_title: title,
      product_url: url || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      product_price: Number(price),
      product_sale: Number(salePrice || 0),
      product_img1: img1,
      product_img2: img2,
      product_img3: img3,
      product_keywords: keywords || '',
      product_desc: desc || '',
      product_features: features || '',
      product_label: label || '',
      cat_id: categoryId
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/products/:id', upload.fields([
  { name: 'img1', maxCount: 1 },
  { name: 'img2', maxCount: 1 },
  { name: 'img3', maxCount: 1 }
]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.product_title = req.body.title || product.product_title;
    product.product_url = req.body.url || product.product_url;
    product.product_price = req.body.price !== undefined ? Number(req.body.price) : product.product_price;
    product.product_sale = req.body.salePrice !== undefined ? Number(req.body.salePrice) : product.product_sale;
    product.product_keywords = req.body.keywords || product.product_keywords;
    product.product_desc = req.body.desc || product.product_desc;
    product.product_features = req.body.features || product.product_features;
    product.product_label = req.body.label || product.product_label;
    product.cat_id = req.body.categoryId || product.cat_id;

    if (req.files['img1']) product.product_img1 = req.files['img1'][0].filename;
    if (req.files['img2']) product.product_img2 = req.files['img2'][0].filename;
    if (req.files['img3']) product.product_img3 = req.files['img3'][0].filename;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= CATEGORY CRUD =================

router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create({ cat_title: req.body.title });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.cat_title = req.body.title || category.cat_title;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SLIDER CRUD =================

router.post('/sliders', upload.single('image'), async (req, res) => {
  try {
    const slide = await Slider.create({
      slide_name: req.body.name,
      slide_image: req.file ? req.file.filename : '',
      slide_url: req.body.url || ''
    });
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/sliders/:id', async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= TERM CRUD =================

router.post('/terms', async (req, res) => {
  try {
    const term = await Term.create({
      term_title: req.body.title,
      term_link: req.body.link,
      term_desc: req.body.desc
    });
    res.status(201).json(term);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/terms/:id', async (req, res) => {
  try {
    const term = await Term.findById(req.params.id);
    if (!term) return res.status(404).json({ message: 'Term not found' });
    term.term_title = req.body.title || term.term_title;
    term.term_link = req.body.link || term.term_link;
    term.term_desc = req.body.desc || term.term_desc;
    await term.save();
    res.json(term);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/terms/:id', async (req, res) => {
  try {
    await Term.findByIdAndDelete(req.params.id);
    res.json({ message: 'Term deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ORDER CRUD =================

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customerId', 'customers_name customers_email')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= CUSTOMER VIEW & DELETE =================

router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({}).select('-customers_pass');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
