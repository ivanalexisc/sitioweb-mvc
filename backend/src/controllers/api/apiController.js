const { Product, Categorie, Color, Talle } = require("../../database/models");

const controller = {
  index: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [Categorie, Color, Talle],
      });

      if (products.length > 0) {
        let respuesta = {
          metadata: {
            status: 200,
            cantidad: products.length,
          },
          resultados: products,
        };
        res.json(respuesta);
      } else {
        respuesta = {
          metadata: {
            status: 204,
            length: products.length,
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Categorie.findAll();
      if (categories.length > 0) {
        let respuesta = {
          metadata: {
            status: 200,
            cantidad: categories.length,
          },
          resultados: categories,
        };
        res.json(respuesta);
      } else {
        respuesta = {
          metadata: {
            status: 204,
            length: categories.length,
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  getColors: async (req, res) => {
    try {
      const colores = await Color.findAll();
      if (colores.length > 0) {
        let respuesta = {
          metadata: {
            status: 200,
            cantidad: colores.length,
          },
          resultados: colores,
        };
        res.json(respuesta);
      } else {
        respuesta = {
          metadata: {
            status: 204,
            length: colores.length,
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  getLastProduct: async (req, res) => {
    try {
      const lastProduct = await Product.findOne({
        include: [Categorie, Color, Talle],
        order: [["created_at", "DESC"]],
      });

      if (lastProduct) {
        res.json({ resultado: lastProduct });
      } else {
        res.status(204).json({ message: "No products found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error fetching the last product" });
    }
  },
  addProduct: async (req, res) => {
    try {
      const { nombre, precio, id_categoria, id_color, id_talle, stock } =
        req.body;

      if (!nombre ||!precio ||!id_categoria ||!id_color ||!id_talle ||!stock) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      const newProduct = await Product.create({
        nombre,
        precio,
        id_categoria,
        id_color,
        id_talle,
        cantidad: stock,
      });
      res.status(201).json({
        message: "Producto creado con éxito",
        producto: newProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al crear el producto" });
    }
  },
};

module.exports = controller;
