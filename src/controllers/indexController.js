const fs = require('fs');
const path = require('path');
const productsFileJson = path.join(__dirname, '../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsFileJson, 'utf-8'));


const controller = {
    
    index: (req, res) => {
        res.render('index', {products});
    },
};

module.exports = controller;