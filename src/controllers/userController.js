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
    login: async (req, res) => {
        let errors = validationResult(req);
        
        if (errors.isEmpty()) {
            console.log('Email recibido:', req.body.email);
            console.log('Contraseña recibida:', req.body.pass);
            
            let user = users.find(usuario => usuario.email == req.body.email);
    
            if (!user) {
                return res.render('login', { errors: [{ msg: 'Credenciales inválidas' }] });
            }
    
            console.log(user);
    
            try {
                let comparePass = await bcrypt.compare(req.body.pass, user.pass);
    
                console.log(comparePass);
    
                if (!comparePass) {
                    return res.render('login', { errors: [{ msg: 'Credenciales inválidas' }] });
                } else {
                    req.session.usuario = user.username; // Guardar en sesión el username del usuario
    
                    // Si se tildó "recordarme", se guarda la cookie
                    if (req.body.recordarme) {
                        // Crear la cookie con un tiempo de expiración (ejemplo: 1 minuto)
                        res.cookie('recordarme', user.username, { maxAge: 1000 * 60 });
                    }
    
                    res.redirect('/products');
                }
            } catch (error) {
                console.error('Error al comparar contraseñas:', error);
                return res.render('login', { errors: [{ msg: 'Error al iniciar sesión' }] });
            }
        } else {
            // Si hay errores de validación (no de credenciales)
            return res.render('login', { errors: errors.errors });
        }
    },
    logout: (req,res) => {
        req.session.destroy();

        res.clearCookie('recordarme');
        
        res.redirect('/products');
    }
};
module.exports = controller;