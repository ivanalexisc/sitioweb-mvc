const { Categorie, Color, Talle } = require('../../database/models');
const { validationResult } = require('express-validator');

const controller = {
  // ==================== CATEGORÍAS ====================

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

  // POST /api/categories (admin)
  createCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const { genero } = req.body;
      if (!genero || !genero.trim()) {
        return res.status(400).json({ ok: false, message: 'El campo "genero" es obligatorio' });
      }
      const category = await Categorie.create({ genero: genero.trim() });
      return res.status(201).json({ ok: true, result: category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al crear categoría' });
    }
  },

  // PUT /api/categories/:id (admin)
  updateCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const category = await Categorie.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
      }
      const { genero } = req.body;
      if (!genero || !genero.trim()) {
        return res.status(400).json({ ok: false, message: 'El campo "genero" es obligatorio' });
      }
      await category.update({ genero: genero.trim() });
      return res.json({ ok: true, result: category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al actualizar categoría' });
    }
  },

  // DELETE /api/categories/:id (admin)
  deleteCategory: async (req, res) => {
    try {
      const category = await Categorie.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
      }
      await category.destroy();
      return res.json({ ok: true, message: 'Categoría eliminada' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al eliminar categoría' });
    }
  },

  // ==================== COLORES ====================

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

  // POST /api/colors (admin)
  createColor: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const { nombre } = req.body;
      if (!nombre || !nombre.trim()) {
        return res.status(400).json({ ok: false, message: 'El campo "nombre" es obligatorio' });
      }
      const color = await Color.create({ nombre: nombre.trim() });
      return res.status(201).json({ ok: true, result: color });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al crear color' });
    }
  },

  // PUT /api/colors/:id (admin)
  updateColor: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const color = await Color.findByPk(req.params.id);
      if (!color) {
        return res.status(404).json({ ok: false, message: 'Color no encontrado' });
      }
      const { nombre } = req.body;
      if (!nombre || !nombre.trim()) {
        return res.status(400).json({ ok: false, message: 'El campo "nombre" es obligatorio' });
      }
      await color.update({ nombre: nombre.trim() });
      return res.json({ ok: true, result: color });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al actualizar color' });
    }
  },

  // DELETE /api/colors/:id (admin)
  deleteColor: async (req, res) => {
    try {
      const color = await Color.findByPk(req.params.id);
      if (!color) {
        return res.status(404).json({ ok: false, message: 'Color no encontrado' });
      }
      await color.destroy();
      return res.json({ ok: true, message: 'Color eliminado' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al eliminar color' });
    }
  },

  // ==================== TALLES ====================

  // GET /api/sizes
  getSizes: async (req, res) => {
    try {
      const sizes = await Talle.findAll();
      return res.json({ ok: true, results: sizes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener talles' });
    }
  },

  // POST /api/sizes (admin)
  createSize: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const { numero } = req.body;
      if (numero === undefined || numero === null || numero === '') {
        return res.status(400).json({ ok: false, message: 'El campo "numero" es obligatorio' });
      }
      const size = await Talle.create({ numero: parseInt(numero) });
      return res.status(201).json({ ok: true, result: size });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al crear talle' });
    }
  },

  // PUT /api/sizes/:id (admin)
  updateSize: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }
      const size = await Talle.findByPk(req.params.id);
      if (!size) {
        return res.status(404).json({ ok: false, message: 'Talle no encontrado' });
      }
      const { numero } = req.body;
      if (numero === undefined || numero === null || numero === '') {
        return res.status(400).json({ ok: false, message: 'El campo "numero" es obligatorio' });
      }
      await size.update({ numero: parseInt(numero) });
      return res.json({ ok: true, result: size });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al actualizar talle' });
    }
  },

  // DELETE /api/sizes/:id (admin)
  deleteSize: async (req, res) => {
    try {
      const size = await Talle.findByPk(req.params.id);
      if (!size) {
        return res.status(404).json({ ok: false, message: 'Talle no encontrado' });
      }
      await size.destroy();
      return res.json({ ok: true, message: 'Talle eliminado' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al eliminar talle' });
    }
  }
};

module.exports = controller;
