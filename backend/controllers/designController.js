const Design = require('../models/Design');
const { generateImage, generateTips } = require('../services/hfService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

exports.uploadMiddleware = upload.single('image');

// Create a new AI design
exports.createDesign = async (req, res) => {
  try {
    const { title, roomType, style, promptText } = req.body;
    let originalImageUrl = null;
    if (req.file) originalImageUrl = `/uploads/${req.file.filename}`;

    // Build AI prompt
    let prompt = `Interior design of a ${roomType} in ${style} style, photorealistic, high quality`;
    if (promptText) prompt = promptText;

    // Generate image from HF
    const imageBuffer = await generateImage(prompt);
    const generatedFileName = `gen_${Date.now()}.png`;
    const generatedPath = path.join('uploads', generatedFileName);
    fs.writeFileSync(generatedPath, imageBuffer);
    const generatedImageUrl = `/uploads/${generatedFileName}`;

    // Generate design tips
    const tips = await generateTips(roomType, style, promptText || '');

    const design = new Design({
      user: req.userId,
      title,
      roomType,
      style,
      originalImageUrl,
      generatedImageUrl,
      designTips: tips,
      colorPalette: [] // we'll extract colours on frontend
    });
    await design.save();

    res.status(201).json(design);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI generation failed. Check your HF token or try again.' });
  }
};

// Get all designs for logged-in user
exports.getUserDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single design
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, user: req.userId });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};