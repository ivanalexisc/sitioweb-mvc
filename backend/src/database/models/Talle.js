const {sequelize, Datatypes} = require('sequelize');

module.exports = (sequelize,Datatypes)=>{
    const talle = sequelize.define('Talle',{
        numero:Datatypes.INTEGER
    },{
        tableName:'talles',
        timestamps: true, // Utiliza `true` para manejar `createdAt` y `updatedAt`
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    })
    talle.associate = (models)=>{
        talle.hasMany(models.Product,{
            foreignKey:'id_talle',
            as : 'products'
        })
    }
    return talle
}