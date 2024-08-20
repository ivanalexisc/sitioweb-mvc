const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('Product', {  // Cambié 'producto' a 'Product'
        nombre:DataTypes.STRING,
        precio: DataTypes.DECIMAL,
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
        product.belongsTo(models.Categorie,{
            foreignKey:'id_categoria',
            timestamps: false
        });
        product.belongsToMany(models.User, {
            as: 'users',
            through: 'producto_user',
            foreignKey: "producto_id",
            otherKey: "user_id",
            timestamps: false
        });
        product.belongsTo(models.Talle,{
            foreignKey:'id_talle',
            timestamps: false
        });
        product.belongsTo(models.Color,{
            foreignKey:'id_color',
            timestamps: false
        })
        
    })
    return product;
};