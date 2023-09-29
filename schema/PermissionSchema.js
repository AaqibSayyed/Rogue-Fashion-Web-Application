const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class Permission extends Model { }

Permission.init({
    permission_name: {type: DataTypes.STRING, allowNull: false}
},{tableName: 'permission', modelName: 'Permission', sequelize})


module.exports={Permission, sequelize}