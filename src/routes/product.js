const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const validator = require('../middlewares/validator');

//Controller require
const productController = require('../controllers/productController');

//SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/images'))
    },
    filename: function (req, file, cb) {
        
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
  });
   
  var upload = multer({ 
      storage,

      //VALIDATE IMAGE
      fileFilter: (req,file,cb) => {
          const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
          const ext = path.extname(file.originalname);
          if(!acceptedExtensions.includes(ext)){
              req.file = file;
          }
          cb(null, acceptedExtensions.includes(ext));
      }

    });


/* GET home page. */
router.get('/',productController.showProduct);
router.get('/detail/:id', productController.detail);
router.get('/create', productController.create);
router.post('/store',upload.single('image'), validator.product, productController.store);

module.exports = router;