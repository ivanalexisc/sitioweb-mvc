const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/api/catalogController');

// GET /api/categories
router.get('/categories', catalogController.getCategories);

// GET /api/colors
router.get('/colors', catalogController.getColors);

// GET /api/sizes
router.get('/sizes', catalogController.getSizes);

module.exports = router;
