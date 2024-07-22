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
           pass:bcrypt.hash(newPassword, 10)
      
        }
        users.push(newUser);
        guardarUser(users);
        res.redirect('/users/login');
    },
    login:  (req, res) => {

        let result = validationResult(req);
        if (result.isEmpty()) {
            
            let userFound = users.find(usuario => usuario.email == req.body.email);
     
            let emailFromUser = userFound.email;
            req.session.usuario = emailFromUser;
            if (req.body.recordarme != undefined) {
             res.cookie("recordame", userFound.email,{maxAge: 1000*60})
            }
            res.redirect('/products')
        } else {
            res.render('login', {errors: result.errors[0].msg, old: req.body.email});
        }
        
    },
    logout: (req,res) => {
        req.session.destroy();

        res.clearCookie('recordarme');
        
        res.redirect('/products');
    }
};
module.exports = controller;