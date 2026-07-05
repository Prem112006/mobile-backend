const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  term_title: { type: String, required: true },
  term_link: { type: String, required: true, unique: true },
  term_desc: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Term', termSchema);
