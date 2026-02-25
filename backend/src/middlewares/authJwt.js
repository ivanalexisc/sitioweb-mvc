const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
require('dotenv').config();

const authJwt = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.role) {
      const user = await User.findByPk(payload.id, { attributes: ['id', 'role'] });
      if (!user) {
        return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
      }
      req.user = { ...payload, role: user.role };
      return next();
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
};

module.exports = authJwt;
