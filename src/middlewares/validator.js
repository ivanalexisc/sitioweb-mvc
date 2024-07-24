const { body } = require('express-validator');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const { log } = require('console');
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

         let userFound = await users.find(user => user.email == req.body.email);
         if (userFound) {
          let resultado =  bcrypt.compareSync(req.body.pass,userFound.pass);
          console.log(req.body.pass)
          
          if(resultado){
            return true
          } else {
            throw new Error('El nombre de usuario y la contraseña que ingresaste no coinciden');
          }


         } else {
          throw new Error('Debes ingresar la contraseña');
         }

        } else {

          throw new Error('El email es obligatorio');
        }
      })
      
      
    ]
};
