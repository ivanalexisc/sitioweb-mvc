var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')


router.get('/register', userController.showRegister);
router.post('/register', userController.createNewUser);
router.get('/login', userController.showLogin);

module.exports = router;
