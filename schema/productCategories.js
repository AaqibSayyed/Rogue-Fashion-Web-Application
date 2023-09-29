const {sequelize, DataTypes, Model, Op} = require('../init/dbconfig')

class ProductCategories extends Model{}

ProductCategories.init({
    p_id: {type: DataTypes.INTEGER, allowNull:false}, 
    c_id: {type: DataTypes.INTEGER, allowNull: false}, 
    created_by: {type: DataTypes.STRING, allowNull: false}, 
    updated_by: {type: DataTypes.STRING, allowNull: true}, 
    updatedAt: {type: DataTypes.DATE, allowNull: true}
},{tableName: 'product_categories', modelName: 'ProductCategories', sequelize})

module.exports = {ProductCategories, sequelize, Op}