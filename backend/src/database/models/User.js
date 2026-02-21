const { sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('User', {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        direccion: DataTypes.STRING,
        email: DataTypes.STRING,
        pw_hash: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        }
    }, {
        tableName: 'usuarios',
        timestamps: true, // Utiliza `true` para manejar `createdAt` y `updatedAt`
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    })
    user.associate = (models => {
        user.belongsToMany(models.Product, {
            foreignKey: 'id_user',
            otherKey: 'id_producto',
            through: 'producto_user',
            as: 'products'
        });
    });
    return user;
}