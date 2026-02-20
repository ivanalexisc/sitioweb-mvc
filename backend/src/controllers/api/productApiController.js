const { validationResult } = require('express-validator');
const { Product, Categorie, Color, Talle } = require('../../database/models');

const controller = {
  // GET /api/products?categoria=1&color=2&talle=3&page=1&limit=10
  index: async (req, res) => {
    try {
      const { categoria, color, talle, page = 1, limit = 10 } = req.query;

      // Construir filtros dinámicos
      const where = {};
      if (categoria) where.id_categoria = categoria;
      if (color) where.id_color = color;
      if (talle) where.id_talle = talle;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [Categorie, Color, Talle],
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      return res.json({
        metadata: {
          status: 200,
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        },
        results: rows
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener productos' });
    }
  },

  // GET /api/products/:id
  detail: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [Categorie, Color, Talle]
      });

      if (!product) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
      }

      return res.json({ ok: true, product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener el producto' });
    }
  },

  // POST /api/products (requiere authJwt)
  store: async (req, res) => {
    try {
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) {
        return res.status(400).json({ ok: false, errors: resultado.array() });
      }

      const { nombre, precio, cantidad, categoria, color, talle } = req.body;

      const newProduct = await Product.create({
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        id_categoria: categoria,
        id_color: color,
        id_talle: talle,
        image: req.file ? req.file.path : null
      });

      // Asociar producto al usuario que lo creó
      await newProduct.addUser(req.user.id);

      // Devolver el producto con sus relaciones
      const product = await Product.findByPk(newProduct.id, {
        include: [Categorie, Color, Talle]
      });

      return res.status(201).json({ ok: true, product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al crear el producto' });
    }
  },

  // PUT /api/products/:id (requiere authJwt)
  update: async (req, res) => {
    try {
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) {
        return res.status(400).json({ ok: false, errors: resultado.array() });
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
      }

      const { nombre, precio, cantidad, categoria, color, talle } = req.body;

      await product.update({
        nombre: nombre || product.nombre,
        precio: precio ? parseFloat(precio) : product.precio,
        cantidad: cantidad ? parseInt(cantidad) : product.cantidad,
        id_categoria: categoria || product.id_categoria,
        id_color: color || product.id_color,
        id_talle: talle || product.id_talle,
        image: req.file ? req.file.path : product.image
      });

      // Actualizar la relación usuario-producto
      await product.removeUsers(await product.getUsers());
      await product.addUser(req.user.id);

      const updatedProduct = await Product.findByPk(product.id, {
        include: [Categorie, Color, Talle]
      });

      return res.json({ ok: true, product: updatedProduct });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al actualizar el producto' });
    }
  },

  // DELETE /api/products/:id (requiere authJwt) — soft delete
  delete: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
      }

      product.status = 'descontinuado';
      await product.save();
      await product.removeUsers(await product.getUsers());
      await product.destroy(); // soft-delete por paranoid: true

      return res.json({ ok: true, message: 'Producto eliminado' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al eliminar el producto' });
    }
  },

  // GET /api/products/last
  last: async (req, res) => {
    try {
      const product = await Product.findOne({
        include: [Categorie, Color, Talle],
        order: [['created_at', 'DESC']]
      });

      if (!product) {
        return res.status(404).json({ ok: false, message: 'No hay productos' });
      }

      return res.json({ ok: true, product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener el producto' });
    }
  }
};

module.exports = controller;
