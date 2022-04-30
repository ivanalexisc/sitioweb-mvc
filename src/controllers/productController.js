const fs = require('fs');
const path = require('path');
const productsFileJson = path.join(__dirname, '../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsFileJson, 'utf-8'));

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
        res.render('product-create-form')
    }
};

module.exports = controller;