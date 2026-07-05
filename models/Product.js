const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_title: { type: String, required: true },
  product_url: { type: String, required: true, unique: true },
  product_price: { type: Number, required: true },
  product_sale: { type: Number, default: 0 },
  product_img1: { type: String, default: '' },
  product_img2: { type: String, default: '' },
  product_img3: { type: String, default: '' },
  product_keywords: { type: String, default: '' },
  product_desc: { type: String, default: '' },
  product_features: { type: String, default: '' },
  product_label: { type: String, default: '' },
  cat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  p_cat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
