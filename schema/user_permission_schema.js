const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class user_permission extends Model { }

user_permission.init ({
    u_id: {type: DataTypes.INTEGER, allowNull: false},
    p_id: {type: DataTypes.STRING, allowNull: false}
},{tableName: 'user_permission', modelName: 'user_permission', sequelize})

module.exports={user_permission, sequelize}