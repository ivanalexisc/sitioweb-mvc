const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {  // Cambié 'producto' a 'Product'
        precio: DataTypes.DECIMAL,
        nombre:DataTypes.STRING,
        cantidad: DataTypes.INTEGER,
        id_categoria: DataTypes.INTEGER,
        id_color: DataTypes.INTEGER,
        id_talle: DataTypes.INTEGER,
        image: DataTypes.STRING
    }, {
        tableName:'productos',
        timestamps: false
    });

    return Product;
};