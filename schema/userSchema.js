const {sequelize, Model, DataTypes} = require('../init/dbconfig.js')

class User extends Model{ }
   
User.init({
    user_name: {type:DataTypes.STRING, allowNull: false },
    user_email: {type:DataTypes.STRING, allowNull: false },  
    user_password: {type:DataTypes.STRING, allowNull: false },
    user_token: {type:DataTypes.STRING, allowNull: true },
    user_otp: {type:DataTypes.INTEGER, allowNull: true },
    is_deleted: {type: DataTypes.INTEGER, allowNull: true}
}, {tableName: 'user', modelName: 'User', sequelize})

module.exports={User, sequelize}