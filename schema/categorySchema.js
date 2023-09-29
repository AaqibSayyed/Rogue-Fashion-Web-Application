const { sequelize, Model, DataTypes, Op} = require('../init/dbconfig')

class Category extends Model{}

Category.init({
    category_name: {type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING, allowNull: false},
    p_id: {type: DataTypes.STRING, allowNull: false}, 
    is_active: {type: DataTypes.INTEGER, allowNull: true},
    is_deleted: {type: DataTypes.INTEGER, allowNull: true}
}, {tableName: 'category', modelName: 'Category', sequelize})


module.exports={Category, sequelize,Op}