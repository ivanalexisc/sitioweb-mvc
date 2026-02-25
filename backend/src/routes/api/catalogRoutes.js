const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/api/catalogController');
const authJwt = require('../../middlewares/authJwt');
const isAdmin = require('../../middlewares/isAdmin');
const validator = require('../../middlewares/validator');

// --- Rutas públicas (GET) ---
router.get('/categories', catalogController.getCategories);
router.get('/colors', catalogController.getColors);
router.get('/sizes', catalogController.getSizes);

// --- Rutas admin (CRUD) ---
// Categorías
router.post('/categories', authJwt, isAdmin, validator.category, catalogController.createCategory);
router.put('/categories/:id', authJwt, isAdmin, validator.category, catalogController.updateCategory);
router.delete('/categories/:id', authJwt, isAdmin, catalogController.deleteCategory);

// Colores
router.post('/colors', authJwt, isAdmin, validator.color, catalogController.createColor);
router.put('/colors/:id', authJwt, isAdmin, validator.color, catalogController.updateColor);
router.delete('/colors/:id', authJwt, isAdmin, catalogController.deleteColor);

// Talles
router.post('/sizes', authJwt, isAdmin, validator.size, catalogController.createSize);
router.put('/sizes/:id', authJwt, isAdmin, validator.size, catalogController.updateSize);
router.delete('/sizes/:id', authJwt, isAdmin, catalogController.deleteSize);

module.exports = router;
