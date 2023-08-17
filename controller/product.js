const product_model = require('../model/product.js')

async function addProductController(req, res) {
    let add_product_check = await product_model.modelAddProdocut(req.body, req.userData).catch((error) => { return { error } })
    console.log(add_product_check)
    if (!add_product_check || (add_product_check && add_product_check.error)) {
        return res.send({ error: add_product_check.error })
    }

    return res.send({ data: add_product_check.data })
}

async function updateProductController(req, res) {
    let params = { ...req.params, ...req.body }
    let update_product_check = await product_model.modelUpdateProduct(params, req.body, req.userData).catch((error) => { return { error } })
    console.log(update_product_check)
    if (!update_product_check || (update_product_check && update_product_check.error)) {
        return res.send({ error: update_product_check.error })
    }
    return res.send({ data: update_product_check.data })
}

async function deleteProductController(req, res) {
    let params = { ...req.params, ...req.body }
    let delete_product_check = await product_model.modelDeleteProdocut(params, req.userData).catch((error) => { return { error } })
    console.log(delete_product_check)
    if (!delete_product_check || (delete_product_check && delete_product_check.error)) {
        return res.send({ error: delete_product_check.error })
    }

    return res.send({ data: delete_product_check.data })
}

async function viewProductController(req, res) {
    let params = { ...req.params, ...req.body }
    let view_product_check = await product_model.modelViewProduct(params).catch((error) => { return { error } })
    console.log(view_product_check)
    if (!view_product_check || (view_product_check && view_product_check.error)) {
        return res.send({ error: view_product_check.error })
    }

    return res.send({ data: view_product_check.data })
}

async function restoreProductController(req, res) {
    let restore_product_check = await product_model.modelRestoreProduct(req.params, req.userData).catch((error) => { return { error } })
    console.log(restore_product_check)
    if (!restore_product_check || (restore_product_check && restore_product_check.error)) {
        return res.send({ error: restore_product_check.error })
    }
    return res.send({ data: restore_product_check.data })
}


async function activeProductController(req, res) {
    let active_product_check = await product_model.modelActiveProduct(req.params, req.userData).catch((error) => { return { error } })
    console.log(active_product_check)
    if (!active_product_check || (active_product_check && active_product_check.error)) {
        return res.send({ error: active_product_check.error })
    }

    return res.send({ data: active_product_check.data })

}


async function deactiveProductController(req, res) {
    let deactive_product_check = await product_model.modelDeactiveProduct(req.params, req.userData).catch((error) => { return { error } })
    console.log(deactive_product_check)
    if (!deactive_product_check || (deactive_product_check && deactive_product_check.error)) {
        return res.send({ error: deactive_product_check.error })
    }

    return res.send({ data: deactive_product_check.data })

}

async function assignController(req, res) {
    let assign_check = await product_model.modelAssign(req.body, req.userData).catch((error) => { return { error } })
    console.log(assign_check)
    if (!assign_check || (assign_check && assign_check.error)) {
        return res.send({ error: assign_check.error })
    }
    return res.send({ data: assign_check.data })
}


async function viewSingleProductController(req, res) {
    let view_single_product_check = await product_model.modelsingleProduct(req.params).catch((error) => { return { error } })
    console.log('APIT CALLED', view_single_product_check)
    if (!view_single_product_check || (view_single_product_check && view_single_product_check.error)) {
        return res.send({ error: view_single_product_check.error })
    }

    return res.send({ data: view_single_product_check.data })
}



module.exports = { addProductController, updateProductController, deleteProductController, viewProductController, restoreProductController, activeProductController, deactiveProductController, assignController, viewSingleProductController }