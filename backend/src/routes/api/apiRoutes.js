var express = require('express');
var router = express.Router();
const apiController = require('../../controllers/api/apiController');
const userApiController = require('../../controllers/api/userApiController');

/* GET home page. */
router.get('/products', apiController.index);
router.get('/categories',apiController.getCategories)
router.get('/users', userApiController.getUsers);





module.exports = router;
