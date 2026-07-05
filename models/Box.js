const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  box_title: { type: String, required: true },
  box_desc: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Box', boxSchema);
