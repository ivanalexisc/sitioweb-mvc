const { Categorie, Color, Talle } = require('../../database/models');

const controller = {
  // GET /api/categories
  getCategories: async (req, res) => {
    try {
      const categories = await Categorie.findAll();
      return res.json({ ok: true, results: categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener categorías' });
    }
  },

  // GET /api/colors
  getColors: async (req, res) => {
    try {
      const colors = await Color.findAll();
      return res.json({ ok: true, results: colors });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener colores' });
    }
  },

  // GET /api/sizes
  getSizes: async (req, res) => {
    try {
      const sizes = await Talle.findAll();
      return res.json({ ok: true, results: sizes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener talles' });
    }
  }
};

module.exports = controller;
