const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('Product', {
        nombre: DataTypes.STRING,
        precio: DataTypes.DECIMAL(10, 2),  // Asegúrate de que el tipo coincida con la base de datos
        cantidad: DataTypes.INTEGER,
        id_categoria: DataTypes.INTEGER,
        id_color: DataTypes.INTEGER,
        id_talle: DataTypes.INTEGER,
        image: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('activo', 'descontinuado'),
            defaultValue: 'activo'
        }
    }, {
        tableName: 'productos',
        timestamps: true, // Utiliza `true` para manejar `createdAt` y `updatedAt`
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    product.associate = (models) => {
        product.belongsTo(models.Categorie, {
            foreignKey: 'id_categoria',
        });
        product.belongsToMany(models.User, {
            as: 'users',
            through: 'producto_user',
            foreignKey: 'id_producto',
            otherKey: 'id_user'
        });
        product.belongsTo(models.Talle, {
            foreignKey: 'id_talle',
        });
        product.belongsTo(models.Color, {
            foreignKey: 'id_color',
        });
    }

    return product;
};
