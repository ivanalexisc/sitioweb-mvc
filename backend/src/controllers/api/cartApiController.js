const { CartItem, Product, Categorie, Color, Talle } = require('../../database/models');

// Helper: trae los items del carrito del usuario con datos del producto
const getCartData = async (userId) => {
  const items = await CartItem.findAll({
    where: { id_user: userId },
    include: [{
      model: Product,
      as: 'product',
      include: [Categorie, Color, Talle]
    }]
  });

  const formattedItems = items.map(item => ({
    productId: item.id_producto,
    nombre: item.product.nombre,
    precio: parseFloat(item.product.precio),
    quantity: item.quantity,
    image: item.product.image,
    subtotal: parseFloat(item.product.precio) * item.quantity
  }));

  const total = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

  return { items: formattedItems, total };
};

const controller = {
  // GET /api/cart
  getCart: async (req, res) => {
    try {
      const cart = await getCartData(req.user.id);
      return res.json({ ok: true, ...cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al obtener el carrito' });
    }
  },

  // POST /api/cart — body: { productId, quantity }
  addToCart: async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ ok: false, message: 'productId es requerido' });
      }

      // Verificar que el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
      }

      // Buscar si ya existe en el carrito
      const existingItem = await CartItem.findOne({
        where: { id_user: req.user.id, id_producto: productId }
      });

      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
        await existingItem.save();
      } else {
        await CartItem.create({
          id_user: req.user.id,
          id_producto: productId,
          quantity: parseInt(quantity)
        });
      }

      const cart = await getCartData(req.user.id);
      return res.status(201).json({ ok: true, ...cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al agregar al carrito' });
    }
  },

  // PUT /api/cart/:productId — body: { quantity }
  updateQuantity: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ ok: false, message: 'La cantidad debe ser al menos 1' });
      }

      const item = await CartItem.findOne({
        where: { id_user: req.user.id, id_producto: productId }
      });

      if (!item) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado en el carrito' });
      }

      item.quantity = parseInt(quantity);
      await item.save();

      const cart = await getCartData(req.user.id);
      return res.json({ ok: true, ...cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al actualizar cantidad' });
    }
  },

  // DELETE /api/cart/:productId
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;

      const item = await CartItem.findOne({
        where: { id_user: req.user.id, id_producto: productId }
      });

      if (!item) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado en el carrito' });
      }

      await item.destroy();

      const cart = await getCartData(req.user.id);
      return res.json({ ok: true, ...cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al eliminar del carrito' });
    }
  },

  // DELETE /api/cart
  clearCart: async (req, res) => {
    try {
      await CartItem.destroy({
        where: { id_user: req.user.id },
        force: true // elimina definitivamente, no soft-delete
      });

      return res.json({ ok: true, message: 'Carrito vaciado' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error al vaciar el carrito' });
    }
  }
};

module.exports = controller;
