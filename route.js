const router = require('express').Router()
const authController = require ('./controller/auth.js')
const categoryController = require ('./controller/category.js')
const productController = require ('./controller/product.js')
const cartController  = require ('./controller/cart.js')
const imageController = require ('./controller/imageController.js')
const authentication = require ('./middleware/auth.js')


//authentication 
router.post ('/register', authController.registerController)
router.post ('/login', authController.loginController)
router.post ('/forgetpassword', authController.forgetPasswordController)
router.put ('/resetpassword', authController.resetPasswordController)
router.put ('/passwordchange',authentication.authMiddleware("user"),authController.passwordChangeController)
router.get ('/viewalluser',authentication.authMiddleware("view_user"),authController.viewUserController)

// Below delete & unDelete APIs are only made for Admins and not  user specific
router.delete ('/deleteuser',authentication.authMiddleware("delete_user"),authController.deleteUserController)
router.post ('/undeleteuser',authentication.authMiddleware("undelete_user"),authController.unDeleteUserController)
router.put ('/updateprofile',authentication.authMiddleware("user"),authController.updateProfileController)

//category
router.post ('/category', authentication.authMiddleware("add_category"), categoryController.createCategoryController)
router.put ('/category/:id',  authentication.authMiddleware("update_category"), categoryController.updateCategoryController)
router.get ('/category/',  authentication.authMiddleware("view_category"), categoryController.viewCategoryController)
router.delete ('/category',  authentication.authMiddleware("delete_category"), categoryController.deleteCategoryController)
router.put('/category/restore/:id',  authentication.authMiddleware("undelete_category"), categoryController.unDeleteCategoryController)

//product

router.post('/api/v1/user/addproduct', authentication.authMiddleware("add_product"), productController.addProductController)
router.put('/api/v1/user/updateproduct/:id', authentication.authMiddleware("update_product"), productController.updateProductController)
router.delete('/api/v1/user/deleteproduct/:id', authentication.authMiddleware("delete_product"), productController.deleteProductController)
router.get('/api/v1/user/viewproduct', productController.viewProductController)
router.put('/api/v1/user/restoreproduct/:id',authentication.authMiddleware("restore_product"), productController.restoreProductController)
router.put('/api/v1/user/activeproduct/:id',authentication.authMiddleware("restore_product"), productController.activeProductController)
router.put('/api/v1/user/deactiveproduct/:id',authentication.authMiddleware("delete_product"), productController.deactiveProductController)
router.get('/api/v1/user/viewsingleproduct/:slug', productController.viewSingleProductController)


router.post('/api/v1/user/product/assign',authentication.authMiddleware("add_product"), productController.assignController)


//add to cart
router.post('/api/v1/user/addcart',authentication.authMiddleware("user"), cartController.addCartController)
router.delete('/api/v1/user/removecart',authentication.authMiddleware("user"), cartController.removeCartItemsController)
router.put('/api/v1/user/updatecart',authentication.authMiddleware("user"), cartController.UpdateCartController)
router.get('/api/v1/user/viewcart',authentication.authMiddleware("user"), cartController.viewCartController)


//image upload 
router.post('/api/v1/user/imageupload',authentication.authMiddleware("user"), imageController.imageUploadController)





module.exports = router; 