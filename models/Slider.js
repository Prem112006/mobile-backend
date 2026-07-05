const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  slide_name: { type: String, required: true },
  slide_image: { type: String, required: true },
  slide_url: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
