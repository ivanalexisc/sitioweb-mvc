const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('Product', {  // Cambié 'producto' a 'Product'
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
    product.associate = (models =>{
        product.belongsTo(models.Categoria);
    })
    return product;
};