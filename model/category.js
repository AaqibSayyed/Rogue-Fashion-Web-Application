const category = require('../schema/categorySchema.js').Category
const joi = require('joi')

//Create category - post method
async function verifyCreateCategory(params) {
    let schema = joi.object({
        category_name: joi.string().min(3).max(30).required(),
        description: joi.string().min(10).max(255).required(),
        p_id: joi.number().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }

        return { error: msg }
    }

    return { data: valid }
}

//user data validation 

async function modelCreateCategory(params) {
    let check = await verifyCreateCategory(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check whether category exist in DB
    let check_category = await category.findOne({ where: { category_name: params.category_name, p_id: params.p_id } }).catch((err) => { return { error: err } })
    // console.log(check_category)

    if (check_category && check_category.error) {
        return { error: "Internal Server Error.", status: 500 }
    }

    else if (check_category && !check_category.error) {
        return { error: "Categry already present.", status: 409 }
    }


    // format data

    let category_insert = {
        category_name: params.category_name,
        description: params.description,
        p_id: params.p_id
    }

    //insert data

    let insert_category = await category.create(category_insert).catch((err) => { return { error: err } })
    // console.log(insert_category)
    if (!insert_category || (insert_category && insert_category.error)) {
        return { error: insert_category.error, status: 500 }
    }

    return { data: insert_category, status: 200 }
}


//category update - put method

async function verifyUpdateCategory(params) {
    let schema = joi.object({
        id: joi.number().required(),
        category_name: joi.string().min(3).max(30).optional(),
        description: joi.string().min(10).max(255).optional(),
        p_id: joi.number().optional()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }

}

async function modelUpdateCategory(params) {
    let check = await verifyUpdateCategory(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    if (!params.category_name && !params.description && !params.p_id) {
        return { error: "Please provide category_name, description or p_id field to update the value", status: 409 }
    }

    //check the provided and previous value
    let check_category = await category.findOne({ where: { id: params.id } }).catch((err) => { return { error: err } })

    if (check_category && check_category.category_name == params.category_name) {
        return { error: "The category name you are trying to change already contains the same name as you provided", status: 409 }
    }

    if (check_category && check_category.description == params.description) {
        return { error: "The category description you are trying to change already contains the same name as you provided", status: 409 }
    }

    if (check_category && check_category.p_id == params.p_id) {
        return { error: "The p_id you are trying to change already contains the same id as you provided", status: 409 }
    }


    //format data to update 

    let query = {}

    if (params.category_name && params.description && params.p_id) {
        query = {
            category_name: params.category_name,
            description: params.description,
            p_id: params.p_id
        }
    }

    else if (params.category_name) {
        query = {
            category_name: params.category_name,
        }
    }

    else if (params.description) {
        query = {
            description: params.description,
        }
    }
    else if (params.p_id) {
        query = {
            p_id: params.p_id,
        }
    }

    let update_category = await category.update(query, { where: { id: params.id } }).catch((err) => { return { error: err } })
    if (!update_category || (update_category && update_category.error)) {
        return { error: "Internal Server Error", status: 500 }
    }

    return { data: "category has been updated", status: 200 }
}



//view category  - get method

// user data verification

async function verifyViewCategory(params) {
    let schema = joi.object({
        id: joi.number(),
        category_name: joi.string().min(3).max(30)
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }
}

async function modelViewCategory(params) {
    let check = await verifyViewCategory(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    let query = {}

    if (params.id) {
        query = { where: { id: params.id } }
    }

    if (params.category_name) {
        query = { where: { category_name: params.category_name } }
    }

    let view_category = await category.findAll(query).catch((error) => { return { error } })
    // console.log(view_category)
    if (!view_category || (view_category && view_category.error)) {
        return { error: "Internal Server Error", status: 500 }
    }

    return { data: view_category, status: 200 }
}

//delete category - delete method

async function verifyDeleteCategory(params) {
    let shcema = joi.object({
        id: joi.number().required(),
        category_name: joi.string().min(3).max(30).required()
    })

    let valid = await shcema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelDeleteCategory(params) {
    let check = await verifyDeleteCategory(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check whether given category exist in db and soft delete
    let delete_category = await category.update({ is_active: 0, is_deleted: 1 }, { where: { id: params.id, category_name: params.category_name } }).catch((error) => { return { error } })

    // console.log(delete_category)

    if ([delete_category] == 0) {
        return { error: "No Category Exist to delete", status: 404 }
    }

    if (delete_category && delete_category.error) {
        return { error: "Internal Server Error", status: 500 }
    }


    return { data: "Category has been deleted", status: 200 }
}


//undelete category - delete method

async function verifyRestoreCategory(params) {
    let shcema = joi.object({
        id: joi.number().required(),
        category_name: joi.string().min(3).max(30).required()
    })

    let valid = await shcema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function modelRestoreCategory(params) {
    let check = await verifyRestoreCategory(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check whether given category exist in db and restore it
    let restore_category = await category.update({ is_active: 1, is_deleted: 0 }, { where: { id: params.id, category_name: params.category_name } }).catch((error) => { return { error } })

    // console.log(restore_category)

    if ([restore_category] == 0) {
        return { error: "Category is already active", status: 409 }
    }

    if (restore_category && restore_category.error) {
        return { error: "Internal Server Error", status: 500 }
    }


    return { data: "Category has been restored", status: 200 }
}


module.exports = { modelCreateCategory, modelUpdateCategory, modelViewCategory, modelDeleteCategory, modelRestoreCategory }