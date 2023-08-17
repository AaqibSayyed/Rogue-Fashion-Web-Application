const joi = require('joi')
const { Product } = require('../schema/product_schema')
const { category, sequelize, Op } = require('../schema/category_schema')
const { product_categories } = require('../schema/product_categories')
const { ValidationError } = require('sequelize')

// data validation

async function verifyAddProduct(params) {
    let schema = joi.object({
        name: joi.string().min(3).max(255).required(),
        brand: joi.string().min(3).max(255).required(),
        detail: joi.string().min(3).required(),
        category_id: joi.number().required(),
        category_name: joi.string().required(),
        stock: joi.number().required(),
        stock_alert: joi.number().required(),
        original_price: joi.number().required(),
        discount: joi.number().required(),
        discount_type: joi.string().required(),
        taxes: joi.number().required(),
        total_amount: joi.number().required(),
        stars: joi.string().required(),
        reviews: joi.string().required(),
        slug: joi.string().required(),
        product_images: joi.string().min(3).max(255).optional()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelAddProdocut(params, userData) {
    let check = await verifyAddProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    
    let find_prodcut = await Product.findOne({ where: { slug: params.slug } }).then((data) => { return { data } }).catch((error) => { return { error } })
    console.log('i am from find product',find_prodcut)
    if (find_prodcut.data) {
        return { error: "Product already exist" }
    }

    if (!find_prodcut || (find_prodcut & find_prodcut.error)) {
        return { error: find_prodcut.error }
    }

    let insert_product = {
        name: params.name,
        brand: params.brand,
        detail: params.detail,
        category_id: params.category_id,
        category_name: params.category_name,
        stock: params.stock,
        stock_alert: params.stock_alert,
        original_price: params.original_price,
        discount: params.discount,
        discount_type: params.discount_type,
        taxes: params.taxes,
        total_amount: params.total_amount,
        stars: params.stars,
        reviews: params.reviews,
        slug: params.slug,
        created_by: userData.name
    }


    let add_product = await Product.create(insert_product).catch((error) => { return { error } })
    if (add_product.error) {
        return { error: add_product.error }
    }

    return { data: add_product }
}

// update prodict put method


async function verifyupdateProduct(params) {
    let schema = joi.object({
        id: joi.number().required(),
        name: joi.string().min(3).max(255).required(),
        brand: joi.string().min(3).max(255),
        detail: joi.string().min(3).max(255),
        category_id: joi.number().required(),
        category_name: joi.string().required(),
        stock: joi.number(),
        stock_alert: joi.number(),
        original_price: joi.number(),
        discount: joi.number(),
        discount_type: joi.string(),
        taxes: joi.number(),
        total_amount: joi.number(),
        stars: joi.string(),
        reviews: joi.string(),
        slug: joi.string(),
        product_images: joi.string()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }

        return { error: msg }
    }

    return { data: valid }
}

async function modelUpdateProduct(params, bodyData, userData) {
    let check = await verifyupdateProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    //check if product already exist
    let find_product = await Product.findOne({ where: { id: params.id } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_product.data) {
        return { error: "No product found" }
    }
    if (find_product.error) {
        return { error: find_product.error }
    }

    let update_product = await Product.update(bodyData, { where: { id: params.id } }).catch((error) => { return { error } })
    if (!update_product || (update_product && update_product.error)) {
        return { error: update_product.error }
    }

    return { data: update_product }
}


//product delete 

async function verifyDeleteProduct(params) {
    let schema = joi.object({
        id: joi.number().required(),
        name: joi.string().min(3).max(20).required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid || (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }
}

async function modelDeleteProdocut(params, userData) {
    let check = await verifyDeleteProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let find_product = await Product.findOne({ where: { id: params.id, name: params.name } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_product.data) {
        return { error: "No product found" }
    }

    if (find_product.error) {
        return { error: find_product.error }
    }

    let delete_product = await Product.update({ is_deleted: 1, is_active: 0, updated_by: userData.id, updatedAt: new Date() },
        { where: { id: params.id, name: params.name } }).catch((error) => { return { error } })

    if (!delete_product || (delete_product && delete_product.error)) {
        return { error: delete_product.error }
    }

    return { data: "Product has been deleted successfully" }

}

// view product

async function verifyViewProduct(params) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string().min(3).max(20)
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid && (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelViewProduct(params) {
    let check = await verifyViewProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let query = {}

    if (params.id) {
        query = {
            where: {
                id: params.id
            }
        }
    }

    if (params.name) {
        query = {
            where: {
                id: params.name
            }
        }
    }

    if (params.id && params.name) {
        query = {
            where: {
                id: params.id,
                name: params.name
            }
        }
    }

    console.log(query)

    let find_data = await Product.findAll(query).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_data) {
        return { error: "No data found" }
    }

    if (find_data.error) {
        return { error: find_data.error }
    }

    return { data: find_data.data }
}



//restore product 

async function verifyRestoreProduct(params) {
    let schema = joi.object({
        id: joi.number().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid && (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }

}

async function modelRestoreProduct(params, userData) {
    let check = await verifyRestoreProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let find_product = await Product.findOne({ where: { id: params.id } }).then((data) => { return { data } }).catch((error) => { return { error } })

    if (!find_product.data) {
        return { error: "No product found" }
    }

    if (find_product.error) {
        return { error: find_product.error }
    }

    if (find_product.data.is_active == 1 && find_product.data.is_deleted == 0) {
        return { error: "Product is already active" }
    }

    console.log()
    let restore_product = await Product.update({ is_active: 1, is_deleted: 0, updated_by: userData.id, updatedAt: new Date() }, { where: { id: params.id } }).catch((error) => { return { error } })

    if (!restore_product || (restore_product && restore_product.error)) {
        return { error: restore_product.error }
    }

    return { data: "Product has been restored successfully" }
}


//active product 

async function verifyActiveProduct(params) {
    let schema = joi.object({
        id: joi.number().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid && (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }

}

async function modelActiveProduct(params, userData) {
    let check = await verifyActiveProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let find_product = await Product.findOne({ where: { id: params.id } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_product.data) {
        return { error: "No product found" }
    }
    if (find_product.error) {
        return { error: find_product.error }
    }

    if (find_product.data.is_deleted == 1) {
        return { error: "This product cannot be made active as it is already deleted, kindly restore the product" }
    }

    if (find_product.data.is_active == 1) {
        return { error: "Product is already active" }
    }

    let product_active = await Product.update({ is_active: 1, updated_by: userData.id, updatedAt: new Date() }, { where: { id: params.id } }).catch((error) => { return { error } })
    if (!product_active || (product_active && product_active.error)) {
        return { error: product_active.error }
    }

    return { data: "Product has been activated" }
}

//deactive product 

async function verifyDeactiveProduct(params) {
    let schema = joi.object({
        id: joi.number().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid && (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }

}

async function modelDeactiveProduct(params, userData) {
    let check = await verifyDeactiveProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let find_product = await Product.findOne({ where: { id: params.id } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_product.data) {
        return { error: "No product found" }
    }
    if (find_product.error) {
        return { error: find_product.error }
    }

    if (find_product.data.is_active == 0) {
        return { error: "Product is already deactive" }
    }

    let product_deactive = await Product.update({ is_active: 0, updated_by: userData.id, updatedAt: new Date() }, { where: { id: params.id } }).catch((error) => { return { error } })
    if (!product_deactive || (product_deactive && product_deactive.error)) {
        return { error: product_deactive.error }
    }

    return { data: "Product has been Deactivated" }

}

//define relation between product and category 

async function verifyassign(params) {
    let schema = joi.object({
        p_id: joi.number().required(),
        c_id: joi.array().items(joi.number().required()).required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid || (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelAssign(params, userData) {
    let check = await verifyassign(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    //check if product id exist in product table

    let find_pid = await Product.findOne({ where: { id: params.p_id } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (!find_pid.data) {
        return { error: "No product found" }
    }
    if (find_pid.error) {
        return { error: find_pid.error }
    }

    //check if category id exist in category table
    let find_category = await category.findAll({ where: { id: params.c_id } }).then((data) => { return { data } }).catch((error) => { return { error } })
    if (find_category.data.length == 0) {
        return { error: "No Category found" }
    }
    if (find_category.error) {
        return { error: find_category.error }
    }

    // check if category count provided by user and category count which we get from DB are same or not.
    if (find_category.data.length != params.c_id.length) {
        return { error: "Please provide correct category ids" }
    }

    //delete all existing p_ids from product_categories table

    let delete_pid = await product_categories.destroy({ where: { p_id: params.p_id } }).catch((error) => { return { error } })
    if (delete_pid.error) {
        return { error: delete_pid.error }
    }

    //format Data


    //insert data into product_categories
    let format_insert = []
    for (let i of params.c_id) {
        format_insert.push({ p_id: params.p_id, c_id: i, created_by: userData.id })
    }

    let product_categories_insert = await product_categories.bulkCreate(format_insert).catch((error) => { return { error } })
    if (!product_categories_insert || (product_categories_insert && product_categories_insert.error)) {
        return { error: product_categories_insert.error }
    }
    return { data: product_categories_insert }

}


// view single product
async function verifysingleProduct(params) {
    let schema = joi.object({
        slug: joi.string().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    let msg = []
    if (!valid && (valid && valid.error)) {
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelsingleProduct(params) {
    let check = await verifysingleProduct(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    // console.log('i am from params',params)

    let find_data = await Product.findOne({ where: { slug: params.slug } }).then((data) => { return { data } }).catch((error) => { return { error } })

    if (!find_data) {
        return { error: "No data found" }
    }

    if (find_data.error) {
        return { error: find_data.error }
    }

    return { data: find_data.data }
}



module.exports = { modelAddProdocut, modelUpdateProduct, modelDeleteProdocut, modelViewProduct, modelRestoreProduct, modelActiveProduct, modelDeactiveProduct, modelAssign, modelsingleProduct }


