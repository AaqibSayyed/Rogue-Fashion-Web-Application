const { sequelize, Model, DataTypes, Op} = require('../init/dbconfig')

class Product extends Model {}

Product.init({
    name: {type: DataTypes.STRING, allowNull: false},
    brand: {type: DataTypes.STRING, allowNull: false},
    detail: {type: DataTypes.STRING, allowNull: false},
    category_id:{type: DataTypes.INTEGER, allowNull: false},
    category_name:{type: DataTypes.STRING, allowNull: false},
    stock: {type: DataTypes.INTEGER, allowNull: false},
    stock_alert: {type: DataTypes.INTEGER, allowNull: false},
    original_price: {type: DataTypes.FLOAT, allowNull: false}, 
    discount: {type: DataTypes.FLOAT, allowNull: false}, 
    discount_type: {type: DataTypes.STRING, allowNull: false}, 
    taxes: {type: DataTypes.FLOAT, allowNull: false}, 
    total_amount: {type: DataTypes.FLOAT, allowNull: false}, 
    stars: {type: DataTypes.STRING, allowNull: false},
    reviews: {type: DataTypes.STRING, allowNull: false},
    slug: {type: DataTypes.STRING, allowNull: false}, 
    is_deleted: {type: DataTypes.INTEGER, allowNull: true}, 
    is_active: {type: DataTypes.INTEGER, allowNull: true}, 
    created_by: {type: DataTypes.STRING, allowNull: false}, 
    updated_by: {type: DataTypes.STRING, allowNull: true}, 
    updatedAt: {type: DataTypes.DATE, allowNull: true}, 
    product_images: {type: DataTypes.STRING, allowNull: true},
    single_product_image: {type: DataTypes.STRING, allowNull: true}
},{tableName: 'product', modelName:'product', sequelize})

module.exports={Product, sequelize, Op}