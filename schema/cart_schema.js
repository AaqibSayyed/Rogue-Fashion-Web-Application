const {sequelize, DataTypes, Model, Op} = require ('../init/dbconfig.js')

class Cart extends Model{}

Cart.init({
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id:{type: DataTypes.INTEGER, allowNull: false}, 
    user_name: {type: DataTypes.STRING, allowNull: false}, 
    product_id: {type: DataTypes.INTEGER, allowNull: false}, 
    product_name: {type: DataTypes.STRING, allowNull: false}, 
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
},{tableName: "Cart", modelName: "Cart", sequelize})

module.exports = {Cart, sequelize, Op}