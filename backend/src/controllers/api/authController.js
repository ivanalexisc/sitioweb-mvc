const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../../database/models');
require('dotenv').config();

const controller = {
  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const { nombre, apellido, direccion, email, password } = req.body;

      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ ok: false, message: 'Todos los campos obligatorios son requeridos' });
      }

      // Verificar si el email ya existe
      const existingUser = await User.findOne({
        where: { email: { [Op.like]: email } }
      });

      if (existingUser) {
        return res.status(409).json({ ok: false, message: 'El email ya está registrado' });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      const newUser = await User.create({
        nombre,
        apellido,
        direccion: direccion || null,
        email,
        pw_hash: passwordHash
      });

      return res.status(201).json({
        ok: true,
        user: { id: newUser.id, nombre: newUser.nombre, email: newUser.email }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error en el servidor' });
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ ok: false, message: 'Email y contraseña son requeridos' });
      }

      const user = await User.findOne({
        where: { email: { [Op.eq]: email } }
      });

      if (!user) {
        return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
      }

      const isMatch = bcrypt.compareSync(password, user.pw_hash);

      if (!isMatch) {
        return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
      }

      // Generar JWT
      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Setear cookie httpOnly
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // cambiar a true en producción con HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      return res.json({
        ok: true,
        user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error en el servidor' });
    }
  },

  // POST /api/auth/logout
  logout: (req, res) => {
    res.clearCookie('token');
    return res.json({ ok: true, message: 'Sesión cerrada' });
  },

  // GET /api/auth/me
  me: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'direccion', 'role']
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
      }

      return res.json({ ok: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error en el servidor' });
    }
  }
};

module.exports = controller;
