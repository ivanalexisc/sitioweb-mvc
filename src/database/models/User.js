const {sequelize, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes)=> {
    const user = sequelize.define('User',{
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        direccion: DataTypes.STRING,
        email: DataTypes.STRING,
        pw_hash: DataTypes.STRING
    },{
        tableName:'usuarios',
        timestamps:false
    })
    user.associate = (models =>{
        user.belongsToMany(models.Product,{
            foreignKey:'id_user',
            through:'producto_user',
            as:'products'
        });
    });
    return user;
}