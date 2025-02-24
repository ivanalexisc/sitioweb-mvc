const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// agregar producto al carrito

router.post('/add/:id', cartController.addToCart);

// ver carrito
router.get('/', cartController.viewCart);

//Eliminar producto del carrito
router.post('/remove/:id', cartController.removeFromCart);

// vaciar carrito
router.post('/clear', cartController.clearCart);
module.exports = router;