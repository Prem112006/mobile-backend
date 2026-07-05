const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  coupon_title: { type: String, required: true },
  coupon_price: { type: Number, required: true },
  coupon_code: { type: String, required: true, unique: true },
  coupon_limit: { type: Number, required: true },
  coupon_used: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
