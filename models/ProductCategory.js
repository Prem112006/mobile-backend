const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  p_cat_title: { type: String, required: true },
  p_cat_top: { type: String, default: 'no' },
  p_cat_image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
