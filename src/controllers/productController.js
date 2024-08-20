const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
let { Product, Categorie , Color, Talle} = require("../database/models");

const controller = {
  showProduct: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.render("index", { products });
    } catch (error) {
      console.log(error);
    }
  },
  detail: async (req, res) => {
    try {
      let id = req.params.id;
      const productoEncontrado = await Product.findByPk(id);
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
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      res.render("product-create-form", resultado);
    } else {
      try {
        const { nombre, precio, cantidad, categoria, color, talle } = req.body;
        const image = req.file ? req.file.filename : null;
        const newProduct = await Product.create({
          nombre: nombre,
          precio: precio,
          cantidad: cantidad,
          id_categoria: categoria,
          id_color: color,
          id_talle: talle,
          image: image,
        });
        await newProduct.addUser(req.session.usuario.id);

        res.redirect("/products");
      } catch (error) {
        console.log(error);
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
