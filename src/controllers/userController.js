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
           domicilio: req.body.domicilio,
           password:bcrypt.hashSync(newPassword, 10)
      
        }
        users.push(newUser);
        guardarUser(users);
        res.redirect('/users/login');
    },
    login: (req, res) => {
        let errors = (validationResult(req));
        if(errors.isEmpty()){
            let user = users.find(usuario => usuario.email == req.body.email);
            req.session.usuario = user.email;
            if (req.body.recordarme){
                res.cookie('recordame', user.email, { maxAge: 1000 * 60 * 60 * 24 * 365});
            }
        
            res.redirect('/products')
        } else {
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