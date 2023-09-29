const model_category = require('../model/category')

//create category controller 
async function createCategoryController(req, res) {
    let createCategoryCheck = await model_category.modelCreateCategory(req.body).catch((err) => { return { error: err } })
    // console.log(createCategoryCheck)
    if (!createCategoryCheck || (createCategoryCheck && createCategoryCheck.error)) {
        return res.status(createCategoryCheck.status).send({ error: createCategoryCheck.error })
    }

    return res.status(createCategoryCheck.status).send({ data: createCategoryCheck.data })
}


//update category controller 

async function updateCategoryController(req, res) {
    let pay_load = { ...req.params, ...req.body }
    let update_category_check = await model_category.modelUpdateCategory(pay_load).catch((err) => { return { error: err } })
    if (!update_category_check || (update_category_check && update_category_check.error)) {
        return res.status(update_category_check.status).send({ error: update_category_check.error })
    }

    return res.status(update_category_check.status).send({ data: update_category_check.data })
}

async function viewCategoryController(req, res) {
    let view_categoty_check = await model_category.modelViewCategory(req.body).catch((error) => { return { error } })
    // console.log(view_categoty_check)
    if (!view_categoty_check || (view_categoty_check && view_categoty_check.error)) {
        return res.status(view_categoty_check.status).send({ error: view_categoty_check.error })
    }

    return res.status(view_categoty_check.status).send({ data: view_categoty_check.data })
}


async function deleteCategoryController(req, res) {
    let delete_category_check = await model_category.modelDeleteCategory(req.body).catch((error) => { return { error } })
    // console.log(delete_category_check)
    if (!delete_category_check || (delete_category_check && delete_category_check.error)) {
        return res.status(delete_category_check.status).send({ error: delete_category_check.error })
    }

    return res.status(delete_category_check.status).send({ data: delete_category_check.data })
}



async function restoreCategoryController(req, res) {
    let undelete_category_check = await model_category.modelRestoreCategory(req.body).catch((error) => { return { error } })
    // console.log(undelete_category_check)
    if (!undelete_category_check || (undelete_category_check && undelete_category_check.error)) {
        return res.status(undelete_category_check.status).send({ error: undelete_category_check.error })
    }

    return res.status(undelete_category_check.status).send({ data: undelete_category_check.data })
}


module.exports = {
    createCategoryController, updateCategoryController, viewCategoryController, deleteCategoryController,
    restoreCategoryController
}