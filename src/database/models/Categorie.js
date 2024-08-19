const {sequelize, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes)=> {
    const categoria = sequelize.define('Categoria',{
        genero: DataTypes.STRING
    },{
        tablename:'categorias',
        timestamps:false
    })
    categoria.associate = (models =>{
        categoria.hasMany(models.Product);
    });
    return categoria;
}