const {sequelize, Datatypes} = require('sequelize');

module.exports = (sequelize,Datatypes)=>{
    const talle = sequelize.define('Talle',{
        numero:Datatypes.INTEGER
    },{
        tableName:'talles',
        timestamps:false
    })
    talle.associate = (models)=>{
        talle.hasMany(models.Product,{
            foreignKey:'id_talle',
            as : 'products'
        })
    }
    return talle
}