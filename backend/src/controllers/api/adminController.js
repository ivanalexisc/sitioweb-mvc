const { Product, User, Categorie, Color, Talle } = require('../../database/models');

const controller = {
    // GET /api/admin/stats
    stats: async (req, res) => {
        try {
            const [totalProducts, totalUsers, totalCategories, totalColors, totalSizes] = await Promise.all([
                Product.count(),
                User.count(),
                Categorie.count(),
                Color.count(),
                Talle.count()
            ]);

            // Últimos 5 productos creados
            const recentProducts = await Product.findAll({
                include: [Categorie, Color, Talle],
                order: [['created_at', 'DESC']],
                limit: 5
            });

            return res.json({
                ok: true,
                stats: {
                    totalProducts,
                    totalUsers,
                    totalCategories,
                    totalColors,
                    totalSizes
                },
                recentProducts
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ ok: false, message: 'Error al obtener estadísticas' });
        }
    }
};

module.exports = controller;
