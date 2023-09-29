const joi = require('joi')
const { Product, sequelize } = require('../schema/productSchema.js')
const multer_helper = require('../helper/multer.js')
const fs = require('fs')
const path = require("path")

//joi validation for upload file 
// here we check against which product id we need to upload a image 

async function verifyUploadImage(params) {
    let schema = joi.object({
        product_id: joi.number().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || valid && valid.error) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}


async function ModelUploadImage(params, files, singlproductfile, userData) {
    let check = await verifyUploadImage(params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    if (!files) {
        return { error: "Please provide product image to upload", status: 400 }
    }

    let image_files = {}
    for (i of files) {
        image_files = i
    }

    // console.log(image_files)
    let file_name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let file_ext = image_files.mimetype.split('/').pop()

    let destination = path.join(__dirname, '../public/')

    let file_upload = await multer_helper.fileUpload(destination + file_name + '_' + params.product_id + '.' + file_ext, image_files.buffer).catch((error) => { return { error } })

    // console.log('i am from multer_helper file Upload', file_upload)

    if (!file_upload || (file_upload && file_upload.error)) {
        return { error: file_upload.error, status: 500 }
    }


    let single_product_image_file = {}

    for (i of singlproductfile) {
        single_product_image_file = i
    }
    // console.log('i am from single_product_image_file', single_product_image_file)
    let single_product_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let single_product_file_ext = single_product_image_file.mimetype.split('/').pop()

    let single_product_file_upload = await multer_helper.fileUpload(destination + single_product_file_name + '_' + params.product_id + '_full' + '.' + file_ext, single_product_image_file.buffer).catch((error) => { return { error } })


    if (!single_product_file_upload || (single_product_file_upload && single_product_file_upload.error)) {
        return { error: single_product_file_upload.error, status: 500 }
    }


    let product_images = 'http://localhost:5000/public/' + file_name + '_' + params.product_id + '.' + file_ext
    let single_product_image = 'http://localhost:5000/public/' + single_product_file_name + '_' + params.product_id + '_full' + '.' + file_ext

    // console.log(single_product_image)

    let product_image_update = await Product.update({ product_images, single_product_image, updated_by: userData.id, updatedAt: Date.now() }, { where: { id: params.product_id } }).catch((error) => { return { error } })
    // console.log('i am from product_image_update',product_image_update)
    if (!product_image_update || (product_image_update && product_image_update.error)) {
        return { error: product_image_update.error, status: 500 }
    }

    return { data: file_upload.data, status: 200 }

}


// async function ModelUploadImage(params, files, userData){
//     let check = await verifyUploadImage(params).catch((error)=>{ return {error}})
//         if (!check || (check && check.error)){
//             return {error: check.error}
//         }

//     console.log(files[0].buffer)

//     fs.writeFile('../product_images/aqib.jpg', files[0].buffer, (err)=>{
//         return {error: err}
//     })

//     return ({data: "file uploaded"})

// }



module.exports = { ModelUploadImage }


