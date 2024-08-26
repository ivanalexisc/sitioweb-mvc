
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize')
const db = require("../database/models")


const controller ={
    showRegister: (req,res) => {
        res.render('register');
    },
    showLogin: (req,res) => {
        res.render('login');
    },
    createNewUser: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render('users/register', {errors: errors.errors})
        }
    
        try {
            // Trato de buscar en la DB si el usuario ya existe.
            let usuarioEncontrar = await db.User.findOne({
                where: {
                    email: {[Op.like]: req.body.email}
                }
            });
    
            // Si NO existe el usuario...
            if(!usuarioEncontrar) {
                // Hasheamos la contraseña del usuario antes de guardarla en la DB
                let passwordHash = bcrypt.hashSync(req.body.password, 10);
    
                // Agregamos los registros en la DB (con la pass hasheada)
                await db.User.create({
                    nombre: req.body.nameUser,
                    apellido:req.body.apellidoUser,
                    direccion:req.body.direccion,
                    email: req.body.email,
                    pw_hash:passwordHash
                });   
            }
    
            // Lo envio a la pantalla del login
            return res.redirect('/users/login');
        } catch (error) {
            console.log(error);
        }
    },
    login: async (req, res) => {
        let result = validationResult(req);
    
        if (result.isEmpty()) {
            try {
                let usuarioLogueado = await db.User.findOne({
                    where: {
                        email: { [Op.eq]: req.body.email }
                    }
                });
    
                if (usuarioLogueado) {
                    bcrypt.compare(req.body.password, usuarioLogueado.pw_hash, (err, isMatch) => {
                        if (err) {
                            console.error(err); // Imprime el error en la consola
                            return res.status(500).render('login', { errors: 'Error en el servidor', old: req.body.email });
                        }
                        if (isMatch) {
                            req.session.usuario = usuarioLogueado;
                            res.cookie("recordarme", usuarioLogueado.email, { maxAge: 1000 * 60 });
                            return res.redirect('/', );
                        } else {
                            res.render('login', { errors: 'Contraseña incorrecta', old: req.body.email });
                        }
                    });
                } else {
                    res.render('login', { errors: 'Correo no registrado', old: req.body.email });
                }
            } catch (error) {
                console.error(error); // Imprime el error en la consola
                res.status(500).render('login', { errors: 'Error en el servidor', old: req.body.email });
            }
        } else {
            console.log(result.errors); // Imprime los errores de validación
            res.render('login', { errors: result.errors[0].msg, old: req.body.email });
        }
    },
    logout: (req,res) => {
        req.session.destroy();

        res.clearCookie('recordarme');
        
        res.redirect('/products');
    }
};
module.exports = controller;