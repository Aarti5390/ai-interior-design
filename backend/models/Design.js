const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  roomType: String,
  style: String,
  originalImageUrl: String,    // user uploaded image URL (optional)
  generatedImageUrl: String,   // AI generated image URL
  designTips: String,           // AI generated text tips
  colorPalette: [String],       // extracted hex colors
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', designSchema);