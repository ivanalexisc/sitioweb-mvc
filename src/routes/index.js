var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController')

/* GET home page. */
router.get('/',indexController.mostrarIndex);
router.get('/product', indexController.showProduct)




module.exports = router;
