const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Rutas API ---
const authRoutes = require('./src/routes/api/authRoutes');
const productApiRoutes = require('./src/routes/api/productRoutes');
const catalogRoutes = require('./src/routes/api/catalogRoutes');
const cartApiRoutes = require('./src/routes/api/cartApiRoutes');
const adminRoutes = require('./src/routes/api/adminRoutes');

// --- Middlewares ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Next.js (puerto por defecto)
  credentials: true
}));
app.use(express.static('public'));

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productApiRoutes);
app.use('/api', catalogRoutes);
app.use('/api/cart', cartApiRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 handler ---
app.use(function (req, res, next) {
  next(createError(404));
});

// --- Error handler (siempre JSON) ---
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
