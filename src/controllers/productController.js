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
        res.render('index', { products });
    },
    detail: (req, res) => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == req.params.id)
                res.render('productDetail', { producto: products[i] })

        }
    },
    create: (req, res) => {
        
        if(!req.session.usuario){
            
            res.render('login', { message: 'Debes iniciar sesión para acceder.' })
        } else{
        
        res.render('product-create-form');
    }
    },
    store: (req, res) => {
        const resultado = validationResult(req);
        if (!resultado.isEmpty()) {
            console.log('Campos recibidos: ', req.body);
            console.log('Archivo recibido: ', req.file);
            let newProduct = {
                id: products[products.length - 1].id + 1,
                name: req.body.name,
                price: parseFloat(req.body.price),
                discount: parseInt(req.body.discount),
                image: req.file.filename,
                category: req.body.category,
                description: req.body.description

            }
            console.log(newProduct);
            products.push(newProduct);
            guardar(products);
            res.redirect('/products');
        } else {
            res.render('product-create-form', resultado)
        }

    },
    edit: (req, res) => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == req.params.id)
                if(!req.session.usuario){
                    res.render('login')
                }else{
                    res.render('productEdit', { producto: products[i] })
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
            image: req.file ? req.file.filename : '', // Si se sube una nueva imagen
            category: req.body.category,
            description: req.body.description
        };
    
        // Iterar sobre los productos para encontrar el que coincide con el ID
        products.forEach(product => {
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
        res.redirect('/products');
    } else {
        res.redirect("productEdit")
    }
    }
};

module.exports = controller;