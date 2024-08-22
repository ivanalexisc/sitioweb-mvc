
const { body, validationResult } = require("express-validator");
let { Product, Categorie , Color, Talle} = require("../database/models");
const db = require("../database/models");

const controller = {
  showProduct: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [Categorie, Color, Talle],
      });
      res.render("index", { products });
    } catch (error) {
      console.log(error);
    }
  },
  detail: async (req, res) => {
    try {
      let id = req.params.id;
      const productoEncontrado = await Product.findByPk(id, {
        include: [Categorie, Color, Talle],
      });
      res.render("productDetail", { productoEncontrado });
    } catch (error) {
      console.log(error);
    }
  },
  create: async(req, res) => {
    if (!req.session.usuario) {
      res.render("login", { message: "Debes iniciar sesión para acceder." });
    } else {
        const categorias = await Categorie.findAll();
        const talles = await Talle.findAll();
        const colores = await Color.findAll();
      res.render("product-create-form", {categorias, talles, colores});
    }
  },
  store: async (req, res) => {
    if (!req.session.usuario) {
      res.redirect('/users/login')
    }
    console.log(req.body);
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
   
      const categorias = await db.Categorie.findAll();
      const colores = await db.Color.findAll();
      const talles = await db.Talle.findAll();

      console.log(resultado.array());
      res.render("product-create-form", {
        errors: resultado.array(),
        categorias: categorias,
        colores: colores,
        talles: talles,
      });
    } else {
      try {
        const { nombre, precio, cantidad, categoria, color, talle } = req.body;
        const newProduct = await Product.create({
          nombre: nombre,
          precio: parseFloat(precio),
          cantidad: parseInt(cantidad),
          id_categoria: categoria, 
          id_color: color,
          id_talle: talle,
          image: req.file ? req.file.filename : "",
        });
        await newProduct.addUser(req.session.usuario.id);

        res.redirect("/products");
      } catch (error) {
        console.error("Error al guardar el producto:", error);
        res.status(500).send("Ocurrió un error al guardar el producto.");
      }
    }
  },

  edit: (req, res) => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id == req.params.id)
        if (!req.session.usuario) {
          res.render("login");
        } else {
          res.render("productEdit", { producto: products[i] });
        }
    }
  },
  update: (req, res) => {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      let productoModificado = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        discount: parseInt(req.body.discount),
        image: req.file ? req.file.filename : "", // Si se sube una nueva imagen
        category: req.body.category,
        description: req.body.description,
      };

      // Iterar sobre los productos para encontrar el que coincide con el ID
      products.forEach((product) => {
        if (product.id == req.params.id) {
          product.name = productoModificado.name;
          product.price = productoModificado.price;
          product.discount = productoModificado.discount;
          product.image = productoModificado.image; // Actualizar imagen si se sube una nueva
          product.category = productoModificado.category;
          product.description = productoModificado.description;
        }
      });

      // Guardar los cambios en el archivo JSON
      guardar(products);

      // Redirigir o renderizar la vista 'index' con los productos actualizados
      res.redirect("/products");
    } else {
      res.redirect("productEdit");
    }
  },
  delete: (req, res) => {
    // guardo el id del producto a borrar
    const productDeleted = req.params.id;
    // borro el producto del json
    const productsFinal = products.filter(
      (product) => product.id != productDeleted
    );
    // modifico el json sin el producto eliminado
    guardar(productsFinal);
    res.redirect("/products");
  },
};

module.exports = controller;
