const model_image = require('../model/productImageAdd.js')
const multer_helper = require('../helper/multer.js')


async function imageUploadController(req, res){
    let check_files = await multer_helper.parseFile(req, res, {
        size: 4000*1000,
        ext: /jpeg|jpg|png/,
        field:[{name: "product_image", maxCount: 1}, {name: "single_product_image", maxCount:1}]}).catch((error)=>{return {error}})
        // console.log('i am from check files', check_files)
        if (!check_files || (check_files && check_files.error)){
            return res.send({error: check_files.error})
        }
    
     console.log('product',req.files.product_image)
     console.log('single',req.files.single_product_image)

    let upload_image_check = await model_image.ModelUploadImage(req.body, req.files.product_image,req.files.single_product_image, req.userData).catch((error)=>{
        return {error}
    })

    console.log(upload_image_check)

    if (!upload_image_check || (upload_image_check && upload_image_check.error)){
        return res.send({error: upload_image_check.error})
    }
    
    return res.send({data: upload_image_check.data})
    
}

module.exports={imageUploadController}