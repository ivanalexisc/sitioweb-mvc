const express = require('express');
const router = express.Router();
const cartApiController = require('../../controllers/api/cartApiController');
const authJwt = require('../../middlewares/authJwt');

// Todas las rutas del carrito requieren autenticación
router.use(authJwt);

// GET /api/cart
router.get('/', cartApiController.getCart);

// POST /api/cart
router.post('/', cartApiController.addToCart);

// PUT /api/cart/:productId
router.put('/:productId', cartApiController.updateQuantity);

// DELETE /api/cart/:productId (quitar un producto)
router.delete('/:productId', cartApiController.removeFromCart);

// DELETE /api/cart (vaciar todo)
router.delete('/', cartApiController.clearCart);

module.exports = router;
