const model_category = require('../model/category')

//create category controller 
async function createCategoryController(req, res) {
    let createCategoryCheck = await model_category.modelCreateCategory(req.body).catch((err) => { return { error: err } })
    console.log(createCategoryCheck)
    if (!createCategoryCheck || (createCategoryCheck && createCategoryCheck.error)) {
        return res.status(400).send({ error: createCategoryCheck.error })
    }

    return res.send({ data: createCategoryCheck.data })
}


//update category controller 

async function updateCategoryController(req, res) {
    let update_category_check = await model_category.modelUpdateCategory(req.body).catch((err) => { return { error: err } })
    if (!update_category_check || (update_category_check && update_category_check.error)) {
        return res.status(400).send({ error: update_category_check.error })
    }

    return res.send({ data: update_category_check.data })
}

async function viewCategoryController(req, res) {
    let view_categoty_check = await model_category.modelViewCategory(req.body).catch((error) => { return { error } })
    console.log(view_categoty_check)
    if (!view_categoty_check || (view_categoty_check && view_categoty_check.error)) {
        return res.send({ error: view_categoty_check.error })
    }

    return res.send({ data: view_categoty_check.data })
}


async function deleteCategoryController(req, res) {
    let delete_category_check = await model_category.modelDeleteCategory(req.body).catch((error) => { return { error } })
    console.log(delete_category_check)
    if (!delete_category_check || (delete_category_check && delete_category_check.error)) {
        return res.send({ error: delete_category_check.error })
    }

    return res.send({ data: delete_category_check.data })
}



async function unDeleteCategoryController(req, res) {
    let undelete_category_check = await model_category.modelUnDeleteCategory(req.body).catch((error) => { return { error } })
    console.log(undelete_category_check)
    if (!undelete_category_check || (undelete_category_check && undelete_category_check.error)) {
        return res.send({ error: undelete_category_check.error })
    }

    return res.send({ data: undelete_category_check.data })
}


module.exports = { createCategoryController, updateCategoryController, viewCategoryController, deleteCategoryController,unDeleteCategoryController }