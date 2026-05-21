const express = require('express');
const auth = require('../middleware/auth');
const { createDesign, getUserDesigns, getDesignById, uploadMiddleware } = require('../controllers/designController');
const router = express.Router();

router.use(auth);
router.post('/', uploadMiddleware, createDesign);
router.get('/', getUserDesigns);
router.get('/:id', getDesignById);

module.exports = router;