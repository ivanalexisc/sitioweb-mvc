const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const usersFileJson = path.join(__dirname, '../data/users.json');
const users =  JSON.parse(fs.readFileSync(usersFileJson, 'utf-8'));
/*const leerJson = () => {
  usersJson = fs.readFileSync(usersFileJson, {encoding: 'utf-8'});
  return JSON.parse(usersJson);
} */
let guardarUser = (users) => {
    fs.writeFileSync(
        path.join(__dirname, '../data/users.json'),
        JSON.stringify(users, null, " "),
        'utf-8'
    );
};

const controller ={
    showRegister: (req,res) => {
        res.render('register');
    },
    showLogin: (req,res) => {
        res.render('login');
    },
    createNewUser: (req,res) => {
        let newPassword = req.body.pass.toString();
        let newUser = {
           nombre: req.body.nameUser,
           email: req.body.email,
           username: req.body.username,
           domicilio: req.body.domicilio,
           pass:bcrypt.hashSync(newPassword, 10)
      
        }
        users.push(newUser);
        guardarUser(users);
        res.redirect('/users/login');
    },
    login: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            console.log('Email recibido:', req.body.email);
        console.log('Contraseña recibida:', req.body.pass);
            let user = users.find(usuario => usuario.email == req.body.email);
            console.log(user);
            let comparePass = bcrypt.compare(req.body.pass, user.pass);
            if (comparePass == false){
                return res.render('login', {errors: [
                    {msg: 'Credenciales invalidas'}
                ]}) 
            }else {
                req.session.usuario = user.username; //guardo en session el username de usuario
		
                //SESSION Y COOKIE SON 2 COSAS DISTINTAS, PUEDO INICIAR SESION SIN GUARDAR COOKIE.
                //si se tildo "recordarme" se guarda la cookie y puedo cerrar el navegador manteniendo la sesion iniciada, si no tildo "recordarme" no se guarda la cookie
                if (req.body.recordarme != undefined) {
                    //quiero crear la cookie
                    res.cookie("recordarme",user.email,{maxAge: 1000 * 60 })
                }
                res.redirect('/products');
            }
          
        } else{ //si hay errores (del validator, osea los que no sean de credenciales) tira esos errores
            return res.render('login', {errors: errors.errors})
        }
    },
    logout: (req,res) => {
        req.session.destroy();

        res.clearCookie('recordame');
        
        res.redirect('/products');
    }
};
module.exports = controller;