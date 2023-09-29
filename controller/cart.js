const model_cart = require('../model/cart.js')
const { modelViewCategory } = require('../model/category.js')

//add cart controller 

async function addCartController(req, res) {
    let add_cart_check = await model_cart.modelAddcart(req.body, req.userData).catch((error) => { return { error } })
    // console.log(add_cart_check)
    if (!add_cart_check || (add_cart_check && add_cart_check.error)) {
        return res.status(add_cart_check.status).send({ error: add_cart_check.error })
    }

    return res.status(add_cart_check.status).send({ data: add_cart_check.data })

}

async function removeCartItemsController(req, res) {
    let remove_cart_check = await model_cart.modelRemoveCartItems(req.body, req.userData).catch((error) => { return { error } })
    // console.log(remove_cart_check)
    if (!remove_cart_check || (remove_cart_check && remove_cart_check.error)) {
        return res.status(remove_cart_check.status).send({ error: remove_cart_check.error })
    }
    return res.status(remove_cart_check.status).send({ data: remove_cart_check.data })
}

async function UpdateCartController(req, res) {
    let update_cart_check = await model_cart.modelUpdateCart(req.body, req.userData).catch((error) => { return { error } })
    // console.log(update_cart_check)
    if (!update_cart_check || (update_cart_check && update_cart_check.error)) {
        return res.status(update_cart_check.status).send({ error: update_cart_check.error })
    }
    return res.status(update_cart_check.status).send({ data: update_cart_check.data })
}

async function viewCartController(req, res) {
    let view_cart_check = await model_cart.modelViewCart(req.userData).catch((error) => { return { error } })
    // console.log(view_cart_check)
    if (!view_cart_check || (view_cart_check && view_cart_check.error)) {
        return res.status(view_cart_check.status).send({ error: view_cart_check.error })
    }

    return res.status(view_cart_check.status).send({ data: view_cart_check.data })
}


module.exports = { addCartController, removeCartItemsController, UpdateCartController, viewCartController }

