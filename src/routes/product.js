const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/* GET home page. */
router.get('/',productController.showProduct);
router.get('/detail/:id', productController.detail);
router.get('/create', productController.create);


module.exports = router;