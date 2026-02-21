const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/api/adminController');
const authJwt = require('../../middlewares/authJwt');
const isAdmin = require('../../middlewares/isAdmin');

// Todas las rutas requieren autenticación + rol admin
router.use(authJwt, isAdmin);

// GET /api/admin/stats
router.get('/stats', adminController.stats);

module.exports = router;
