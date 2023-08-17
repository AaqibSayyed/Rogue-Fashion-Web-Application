const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class user extends Model{ }
   
user.init({
    user_name: {type:DataTypes.STRING, allowNull: false },
    user_email: {type:DataTypes.STRING, allowNull: false },  
    user_password: {type:DataTypes.STRING, allowNull: false },
    user_token: {type:DataTypes.STRING, allowNull: true },
    user_otp: {type:DataTypes.INTEGER, allowNull: true },
    is_deleted: {type: DataTypes.INTEGER, allowNull: true}
}, {tableName: 'user', modelName: 'user', sequelize})

module.exports={user, sequelize}