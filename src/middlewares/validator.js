const { body } = require('express-validator');
module.exports = {
    product: [
      body('name')
        .notEmpty()
        .withMessage('El campo de nombre es obligatorio')
        .isLength({min:5, max: 20})
        .withMessage('El campo debe ser un precio '),
        body('discount')
        .notEmpty()
        .withMessage('El campo debe ser un numero'),
        body('image')
        .notEmpty()
        .custom(function(value, { req }){
          if(req.file != undefined) {
            return true;
          } 
          return false;
        })
        .withMessage('Imagen obligatoria')
        .bail()
        
        .custom(function(value, { req }){
          if (req.file != undefined){
            let ext = path.extname(req.file.originalname);
            if(ext == '.jpg' || ext == '.jpeg' || ext == '.png'){
              return true;
            }
             return false;
          }
         

        })
        .withMessage('Imagen incorrecta')
       
    ],
    login: [
      body('email')
      .notEmpty()
      .withMessage('Completar email'),
      body('password')
      .notEmpty()
      .withMessage('Completar contraseña'),
    ]
};