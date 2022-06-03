const { body } = require('express-validator');
module.exports = {
    product: [
      body('name')
        .notEmpty()
        .withMessage('El campo de nombre es obligatorio')
        .isLength({min:5, max: 20})
        .withMessage('El campo no es un email'),
        body('discount')
        .notEmpty()
       
    ]
};