const {sequelize, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes)=> {
    const categoria = sequelize.define('Categorie',{
        genero: DataTypes.STRING
    },{
        tableName:'categorias',
        timestamps:false
    })
    categoria.associate = (models =>{
        categoria.hasMany(models.Product,{
            foreignKey:'id_categoria'
        });
    });
    return categoria;
}