const express = require('express');
const auth = require('../middleware/auth');
const { createDesign, getUserDesigns, getDesignById, uploadMiddleware } = require('../controllers/designController');
const router = express.Router();

// ✅ Auth is correctly applied only to these routes
router.use(auth);
router.post('/', uploadMiddleware, createDesign);
router.get('/', getUserDesigns);
router.get('/:id', getDesignById);

module.exports = router;