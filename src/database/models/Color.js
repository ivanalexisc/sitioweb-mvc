const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const color = sequelize.define('Color', {
        nombre: DataTypes.STRING 
    } , {
        tableName: 'colores',
        timestamps: true, // Utiliza `true` para manejar `createdAt` y `updatedAt`
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });
    color.associate = (models) => {
        color.hasMany(models.Product, {
            foreignKey: 'id_color',
            as : 'products'
        });
    };
    return color;
}