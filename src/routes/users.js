var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../middlewares/validator');


router.get('/register', userController.showRegister);
router.post('/register', userController.createNewUser);
router.get('/login', userController.showLogin);
router.post('/login', validator.login, userController.login);
router.get('/logout', userController.logout);

module.exports = router;
