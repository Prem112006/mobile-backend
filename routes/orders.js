const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const { protectCustomer } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order (COD or Online initialization)
router.post('/', protectCustomer, async (req, res) => {
  try {
    const { paymentMode, couponCode, items: directItems } = req.body;
    let items = [];
    let subTotal = 0;
    const isBuyNow = !!(directItems && directItems.length > 0);

    if (isBuyNow) {
      // Direct checkout (Buy Now) bypasses cart populated DB checks
      for (const item of directItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        const price = product.product_label === 'sale' ? product.product_sale : product.product_price;
        const amount = price * item.qty;
        subTotal += amount;

        items.push({
          productId: product._id,
          qty: item.qty,
          size: item.size || '',
          price
        });
      }
    } else {
      // Standard checkout from DB Cart
      const cart = await Cart.findOne({ customerId: req.customer._id }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Shopping cart is empty' });
      }

      items = cart.items.map(item => {
        const price = item.productId.product_label === 'sale' ? item.productId.product_sale : item.productId.product_price;
        const amount = price * item.qty;
        subTotal += amount;

        return {
          productId: item.productId._id,
          qty: item.qty,
          size: item.size,
          price
        };
      });
    }

    const taxAmount = Math.round(subTotal * 0.18);
    let dueAmount = subTotal + taxAmount;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ coupon_code: couponCode });
      if (coupon) {
        if (coupon.coupon_limit > coupon.coupon_used) {
          dueAmount = Math.max(0, dueAmount - coupon.coupon_price);
          coupon.coupon_used += 1;
          await coupon.save();
        }
      }
    }

    const invoiceNo = Math.floor(Math.random() * 1000000000);

    const order = await Order.create({
      customerId: req.customer._id,
      invoiceNo,
      dueAmount,
      taxAmount,
      paymentMode: paymentMode || 'COD',
      orderStatus: 'pending',
      paymentStatus: paymentMode === 'Online' ? 'pending' : 'pending',
      items,
      isBuyNow
    });

    // Clear cart if Cash on Delivery AND not direct Buy Now checkout
    if (paymentMode === 'COD' && !isBuyNow) {
      const cart = await Cart.findOne({ customerId: req.customer._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/orders/confirm-payment
// @desc    Confirm payment & clear cart (simulated Razorpay return)
router.post('/confirm-payment', protectCustomer, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'Completed';
    order.orderStatus = 'processing';
    await order.save();

    // Clear cart after successful online payment if it's not a Buy Now checkout
    if (!order.isBuyNow) {
      const cart = await Cart.findOne({ customerId: req.customer._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    }

    res.json({ message: 'Payment confirmed and cart cleared', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get order history of logged-in customer
router.get('/my-orders', protectCustomer, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.customer._id, orderStatus: { $ne: 'cancelled' } })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel a pending order
router.put('/:id/cancel', protectCustomer, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Ensure the order belongs to the logged-in customer
    if (order.customerId.toString() !== req.customer._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this order' });
    }

    // Verify order is still pending
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
