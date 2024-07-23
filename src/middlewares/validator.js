const { body } = require('express-validator');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const usersFileJson = path.join(__dirname, '../data/users.json');
const users =  JSON.parse(fs.readFileSync(usersFileJson, 'utf-8'));
module.exports = {
    product: [
      body('name')
        .notEmpty()
        .withMessage('El campo de nombre es obligatorio')
        .isLength({min:5, max: 20}),
        body('price')
        .notEmpty()
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
      .custom(async function(value, {req}){
        if(value){

         let userFound = users.find(user => user.email == req.body.email);
         if (userFound) {
          let resultado =await  bcrypt.compare(req.body.pass,userFound.pass);
          
          console.log(userFound);
          console.log(resultado);
          return resultado;


         } else {
          return false 
         }

        } else {

          return false
        }
      })
      .withMessage('El nombre de usuario y la contraseña que ingresaste no coinciden'),
      
    ]
};
