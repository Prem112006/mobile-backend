const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoiceNo: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  orderStatus: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'pending' },
  paymentMode: { type: String, default: 'COD' },
  orderDate: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true },
      size: { type: String, default: '' },
      price: { type: Number, required: true }
    }
  ],
  isBuyNow: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
