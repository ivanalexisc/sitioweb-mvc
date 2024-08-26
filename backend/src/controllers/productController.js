
const { body, validationResult } = require("express-validator");
let { Product, Categorie , Color, Talle, User} = require("../database/models");
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

  edit: async (req, res) => {
    const categorias = await db.Categorie.findAll();
      const colores = await db.Color.findAll();
      const talles = await db.Talle.findAll();
    const productoId = req.params.id;
    const productoToEdit = await Product.findByPk(productoId,{include : ['Categorie', 'Talle', 'Color']});
    res.render('productEdit', {
      productoToEdit,
      categorias:categorias,
      talles:talles,
      colores:colores
    })
    console.log(productoToEdit);
  },
  update:async (req, res) => {
   try {
    const productoId = req.params.id;
       const productoChanged = await Product.findByPk(productoId, {include: [
        'Categorie', 'Talle', 'Color'
       ]});
       await productoChanged.removeUser(productoChanged.user);
       await productoChanged.addUser(req.session.usuario.id);
       await productoChanged.update(req.body)
       res.redirect("/")
   } catch (error) {
    console.log(error);
   }

  },
  delete: async (req, res) => {
   try {
      const productId = req.params.id;
      const productToDelete = await Product.findByPk(productId,{
        include:['Categorie', 'Talle', 'Color']
      });

      productToDelete.status= 'descontinuado';
      await productToDelete.save();
      await productToDelete.removeUser(productToDelete.user);
      await productToDelete.destroy();
      res.redirect('/');
   } catch (error) {
    
   }
  },
};

module.exports = controller;
