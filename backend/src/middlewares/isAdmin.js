const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, message: 'Acceso denegado: se requiere rol de administrador' });
    }
    next();
};

module.exports = isAdmin;
