const fs = require('fs');
const path = require('path');
const usersFileJson = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersFileJson, 'utf-8'));

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
        let newUser = {
           nombre: req.body.nameUser,
           email: req.body.email,
           domicilio: req.body.domicilio,
           password:req.body.pass

        }
        console.log(req.body);
        users.push(newUser);
        guardarUser(users);
        res.redirect('/');
    }
};
module.exports = controller;