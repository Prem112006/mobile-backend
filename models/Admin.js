const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  admin_pass: { type: String, required: true }, // will store plain or bcrypt, we'll support bcrypt
  admin_image: { type: String, default: '' },
  admin_country: { type: String, default: '' },
  admin_about: { type: String, default: '' },
  admin_contact: { type: String, default: '' },
  admin_job: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
