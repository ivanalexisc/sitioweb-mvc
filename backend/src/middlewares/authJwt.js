const jwt = require('jsonwebtoken');
require('dotenv').config();

const authJwt = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, nombre, email }
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
};

module.exports = authJwt;
