const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customers_name: { type: String, required: true },
  customers_email: { type: String, required: true, unique: true },
  customers_pass: { type: String, required: true },
  customers_country: { type: String, default: '' },
  customers_city: { type: String, default: '' },
  customers_contact: { type: String, default: '' },
  customers_address: { type: String, default: '' },
  customers_image: { type: String, default: '' },
  customers_ip: { type: String, default: '' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  loginOtpToken: { type: String, default: null },
  loginOtpExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
