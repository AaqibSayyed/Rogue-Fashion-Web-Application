const {Sequelize, Model, DataTypes, Op} = require('sequelize')

const sequelize= new Sequelize('Mysql://root:@localhost/ecom')

sequelize.authenticate().then(()=>{console.log('connected to Database')}).catch((err)=>{console.log(err)})

module.exports = { sequelize, Model, DataTypes, Op}