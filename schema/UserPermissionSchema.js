const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class UserPermission extends Model { }

UserPermission.init ({
    u_id: {type: DataTypes.INTEGER, allowNull: false},
    p_id: {type: DataTypes.STRING, allowNull: false}
},{tableName: 'user_permission', modelName: 'UserPermission', sequelize})

module.exports={UserPermission, sequelize}