
const {Product, Categorie, Color, Talle} = require('../database/models');


const controller = {
    
    index: async(req, res) => {
        try {
            const products = await Product.findAll({
                include: [Categorie, Color, Talle],
            })
            res.render('index', { products });
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = controller;
