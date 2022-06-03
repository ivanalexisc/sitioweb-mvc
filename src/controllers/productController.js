const fs = require('fs');
const { body, validationResult } = require('express-validator');
const path = require('path');

const productsFileJson = path.join(__dirname, '../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsFileJson, 'utf-8'));
let guardar = (products) => {
	fs.writeFileSync(
	  path.join(__dirname, "../data/productsDB.json"),
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
       if (resultado.isEmpty()){

        let newProduct = {
            id:products[products.length -1].id + 1,
            ...req.body,
           
        }
        products.push(newProduct);
        guardar(products);
        res.redirect('/products/create');
        }  else {
        res.render('product-create-form', resultado )
        }

    }
};

module.exports = controller;