var express = require('express');
var router = express.Router();
const apiController = require('../../controllers/api/apiController');

/* GET home page. */
router.get('/products', apiController.index);





module.exports = router;
