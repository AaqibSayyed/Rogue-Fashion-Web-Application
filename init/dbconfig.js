const dotenv =require('dotenv')
dotenv.config()

const DB_PASSWORD = process.env.DB_PASSWORD;

const {Sequelize, Model, DataTypes, Op} = require('sequelize')
const sequelize= new Sequelize(`Mysql://${DB_PASSWORD}:@localhost/ecom`)
sequelize.authenticate().then(()=>{console.log('connected to Database')}).catch((err)=>{console.log(err)})
module.exports = { sequelize, Model, DataTypes, Op}