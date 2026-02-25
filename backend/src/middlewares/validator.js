const { body } = require('express-validator');
const path = require('path');


module.exports = {
    product: [
      body('nombre')
        .notEmpty()
        .withMessage('El campo de nombre es obligatorio')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('precio')
        .notEmpty()
        .withMessage('El campo debe ser un precio '),
        body('cantidad')
        .notEmpty()
        .withMessage('El campo debe ser un numero'),
        // body('image')
        // .notEmpty()
        // .custom(function(value, { req }){
        //   if(req.file != undefined) {
        //     return true;
        //   } 
        //   return false;
        // })
        // .withMessage('Imagen obligatoria')
        // .bail()
        
        // .custom(function(value, { req }){
        //   if (req.file != undefined){
        //     let ext = path.extname(req.file.originalname);
        //     if(ext == '.jpg' || ext == '.jpeg' || ext == '.png'){
        //       return true;
        //     }
        //      return false;
        //   }
         

        // })
        // .withMessage('Imagen incorrecta')
       
    ],
    login: [
      body("email")
            .notEmpty()
            .isEmail()
            .withMessage('Email inválido.'),
        body("password")
            .notEmpty()
            .withMessage('Su mail o contraseña no concuerdan.')
            
    ],
    category: [
      body('genero')
        .notEmpty()
        .withMessage('El campo genero es obligatorio')
        .bail()
        .trim()
    ],
    color: [
      body('nombre')
        .notEmpty()
        .withMessage('El campo nombre es obligatorio')
        .bail()
        .trim()
    ],
    size: [
      body('numero')
        .notEmpty()
        .withMessage('El campo numero es obligatorio')
        .bail()
        .isInt()
        .withMessage('El campo numero debe ser un entero')
    ]
};
