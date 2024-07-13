const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const productsFileJson = path.join(__dirname, '../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsFileJson, 'utf-8'));
let guardar = (products) => {
	fs.writeFileSync(
	  path.join(__dirname, "../data/productsDb.json"),
	  JSON.stringify(products, null, " "),
	  "utf-8"
	);
  };

const controller = {
    showProduct: (req, res) => {
        res.render('index', {products});
    },
    detail : (req,res) => {
        for(let i = 0; i< products.length; i++){
            if (products[i].id == req.params.id)
            res.render('productDetail', {producto:products[i]})

        }
    },
    create: (req,res) => {
        res.render('product-create-form');
    },
    store: (req,res) => {
       const resultado = validationResult(req);
       if (!resultado.isEmpty()){
        console.log('Campos recibidos: ', req.body);
        console.log('Archivo recibido: ', req.file);
        let newProduct = {
            id:products[products.length -1].id + 1,
            nombre:req.body.name,
            precio:req.body.price,
            descuento:req.body.discount,
            image: req.file.filename,
            categoria:req.body.category,
            description:req.body.description
           
        }
        console.log(newProduct);
        products.push(newProduct);
        guardar(products);
        res.redirect('/products');
        }  else {
        res.render('product-create-form', resultado )
        }

    }
};

module.exports = controller;