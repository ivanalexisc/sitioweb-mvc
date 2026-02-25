const { validationResult } = require('express-validator');
const { Product, Categorie, Color, Talle, ProductImage } = require('../../database/models');

const imageInclude = {
  model: ProductImage,
  as: 'images',
  attributes: ['id', 'image', 'is_primary']
};

const getUploadedImages = (req) => {
  if (!req.files) return [];
  if (Array.isArray(req.files)) return req.files;

  const images = req.files.images || [];
  const legacyImage = req.files.image || [];
  return [...images, ...legacyImage];
};

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
        include: [Categorie, Color, Talle, imageInclude],
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
        include: [Categorie, Color, Talle, imageInclude]
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
      if (req.fileValidationError) {
        return res.status(400).json({ ok: false, message: req.fileValidationError });
      }

      const uploadedImages = getUploadedImages(req);

      if (!uploadedImages.length) {
        return res.status(400).json({ ok: false, message: 'La imagen es obligatoria para crear un producto' });
      }

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
        image: `images/${uploadedImages[0].filename}`
      });

      await ProductImage.bulkCreate(
        uploadedImages.map((file, index) => ({
          id_producto: newProduct.id,
          image: `images/${file.filename}`,
          is_primary: index === 0
        }))
      );

      // Asociar producto al usuario que lo creó
      await newProduct.addUser(req.user.id);

      // Devolver el producto con sus relaciones
      const product = await Product.findByPk(newProduct.id, {
        include: [Categorie, Color, Talle, imageInclude]
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
      if (req.fileValidationError) {
        return res.status(400).json({ ok: false, message: req.fileValidationError });
      }

      const uploadedImages = getUploadedImages(req);

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
        image: uploadedImages.length ? `images/${uploadedImages[0].filename}` : product.image
      });

      if (uploadedImages.length) {
        await ProductImage.destroy({ where: { id_producto: product.id } });
        await ProductImage.bulkCreate(
          uploadedImages.map((file, index) => ({
            id_producto: product.id,
            image: `images/${file.filename}`,
            is_primary: index === 0
          }))
        );
      }

      // Actualizar la relación usuario-producto
      await product.removeUsers(await product.getUsers());
      await product.addUser(req.user.id);

      const updatedProduct = await Product.findByPk(product.id, {
        include: [Categorie, Color, Talle, imageInclude]
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
      await ProductImage.destroy({ where: { id_producto: product.id } });
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
        include: [Categorie, Color, Talle, imageInclude],
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
