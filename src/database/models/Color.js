const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const color = sequelize.define('Color', {
        nombre: DataTypes.STRING 
    } , {
        tableName: 'colores',
        timestamps: false
    });
    color.associate = (models) => {
        color.hasMany(models.Product, {
            foreignKey: 'id_color'
        });
    };
    return color;
}