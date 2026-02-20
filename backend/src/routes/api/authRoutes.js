const express = require('express');
const router = express.Router();
const authController = require('../../controllers/api/authController');
const authJwt = require('../../middlewares/authJwt');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me (protegida)
router.get('/me', authJwt, authController.me);

module.exports = router;
