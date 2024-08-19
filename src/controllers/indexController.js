const fs = require('fs');
const path = require('path');
const {Product} = require('../database/models');


const controller = {
    
    index: async(req, res) => {
        try {
            const products = await Product.findAll()
            res.render('index', { products });
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = controller;
