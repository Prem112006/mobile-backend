const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protectCustomer } = require('../middleware/auth');

// Helper to get or create cart
const getOrCreateCart = async (customerId) => {
  let cart = await Cart.findOne({ customerId }).populate('items.productId');
  if (!cart) {
    cart = await Cart.create({ customerId, items: [] });
  }
  return cart;
};

// @route   GET /api/cart
// @desc    Get current customer's cart
router.get('/', protectCustomer, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.customer._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/add
// @desc    Add product to cart
router.post('/add', protectCustomer, async (req, res) => {
  try {
    const { productId, qty, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const price = product.product_label === 'sale' ? product.product_sale : product.product_price;

    let cart = await Cart.findOne({ customerId: req.customer._id });
    if (!cart) {
      cart = await Cart.create({ customerId: req.customer._id, items: [] });
    }

    // Check if product with same size already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === (size || '')
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += parseInt(qty || 1);
    } else {
      cart.items.push({
        productId,
        qty: parseInt(qty || 1),
        size: size || '',
        price
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cart/update-qty
// @desc    Update quantity of a cart item
router.put('/update-qty', protectCustomer, async (req, res) => {
  try {
    const { productId, qty, size } = req.body;
    const cart = await Cart.findOne({ customerId: req.customer._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === (size || '')
    );

    if (itemIndex > -1) {
      if (qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].qty = parseInt(qty);
      }
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/remove
// @desc    Remove product from cart
router.delete('/remove', protectCustomer, async (req, res) => {
  try {
    const { productId, size } = req.body;
    const cart = await Cart.findOne({ customerId: req.customer._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === (size || ''))
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
router.delete('/clear', protectCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.customer._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
