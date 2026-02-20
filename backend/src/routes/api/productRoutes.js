const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const productApiController = require('../../controllers/api/productApiController');
const authJwt = require('../../middlewares/authJwt');
const validator = require('../../middlewares/validator');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname);
    if (!acceptedExtensions.includes(ext)) {
      req.file = file;
    }
    cb(null, acceptedExtensions.includes(ext));
  }
});

// --- Rutas públicas ---
router.get('/', productApiController.index);
router.get('/last', productApiController.last);
router.get('/:id', productApiController.detail);

// --- Rutas protegidas ---
router.post('/', authJwt, upload.single('image'), validator.product, productApiController.store);
router.put('/:id', authJwt, upload.single('image'), validator.product, productApiController.update);
router.delete('/:id', authJwt, productApiController.delete);

module.exports = router;
