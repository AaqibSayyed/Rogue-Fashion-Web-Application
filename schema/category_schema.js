const { sequelize, Model, DataTypes, Op} = require('../init/dbconfig')

class category extends Model{}

category.init({
    category_name: {type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING, allowNull: false},
    p_id: {type: DataTypes.STRING, allowNull: true}, 
    is_active: {type: DataTypes.INTEGER, allowNull: false},
    is_deleted: {type: DataTypes.INTEGER, allowNull: false}
}, {tableName: 'category', modelName: 'category', sequelize})


module.exports={category, sequelize,Op}