const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true, default: 1 },
      size: { type: String, default: '' },
      price: { type: Number, required: true } // capture product price at addition
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
