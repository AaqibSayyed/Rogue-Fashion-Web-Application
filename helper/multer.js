const multer = require('multer')
const fs = require('fs')



async function parseFile(req, res, options = {}) {
    let limits = options.size ? options.size : 1024 * 5;
    let ext = options.ext ? options.ext : /jpeg|jpg|png/;
    let field = options.field ? options.field : null;
    if (!field) {
        return { error: "Please provide fields" }
    }

    let file = multer({
        limits,
        fileFilter: (req, files, cb) => {
            // console.log('konis file aayi hai hamare pas', files)
            let check = ext.test(files.mimetype)
            // console.log('i am from fileFilter extension matches with file mimetype(true) or not(false)', check)
            if (!check) {
                return cb({ error: "This file format is not allowed" })
            }
            return cb(null, { data: true })
        }
    })


    if (typeof (field) == "string") {
        file = file.single(field)
    }

    else if (typeof (field) == "object") {
        file = file.fields(field)
    }

    
    return new Promise((resolved, reject) => {
        file(req, res, (error, data) => {
            if (error) {
                reject(error)
            }
            else resolved(true)
        })
    })
}



// function fileUpload(destination, buffer) {
//     let file_upload = fs.writeFile(destination, buffer, (err) => {
//         if (err) {
//             // console.log('i am from file upload error',file_upload)
//             return { error: err }
//         }
//     })
//     // console.log('i am from file upload data',file_upload)
//     return { data: "File has been uploaded" }

// }


async function fileUpload(destination, buffer) {
    return new Promise ((resolved,reject)=>{
       fs.writeFile(destination, buffer,(error, data)=>{
            if (error){
                reject({error})
            }

            else resolved({data:"File Uploaded"})
        })
    })
}





module.exports = { parseFile, fileUpload }
