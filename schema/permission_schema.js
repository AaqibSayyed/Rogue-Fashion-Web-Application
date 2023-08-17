const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class permission extends Model { }

permission.init({
    permission_name: {type: DataTypes.STRING, allowNull: false}
},{tableName: 'permission', modelName: 'permission', sequelize})


module.exports={permission, sequelize}