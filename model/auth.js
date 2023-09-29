const joi = require('joi')
const  user = require('../schema/userSchema.js').User
const permission = require('../schema/PermissionSchema.js').Permission
const user_permission = require('../schema/UserPermissionSchema.js').UserPermission
const security = require('../helper/security.js')
const nodemailer = require('../helper/mailer.js')
const Joi = require('joi')
const randomstring = require('randomstring')
const nodeMailer = require('../helper/mailer.js')
const { dcryptJWT } = require('../helper/security.js')

//Registration 

async function verifyRegister(params) {
    let schema = joi.object({
        user_name: joi.string().min(5).max(20).required(),
        user_email: joi.string().min(5).max(30).email().required(),
        user_password: joi.string().min(5).max(20).required()
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


async function modelRegister(params) {

    let check = await verifyRegister(params).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }


    // Verifying whether user already exist in Database  or not

    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    // console.log(find_email)
    if (find_email && !find_email.error) {
        return { error: 'User already exist', status: 409 }
    }

    else if (find_email && find_email.error) {
        return { error: 'Internal Server Error, please try again', status: 500 }
    }

    //hashing password 
    let hashEnryptedPassword = await security.hash(params.user_password, 10).catch((err) => { return { error: err } })
    // console.log('hashEnryptedPassword', hashEnryptedPassword)
    if (!hashEnryptedPassword || hashEnryptedPassword && hashEnryptedPassword.error) {
        return { error: hashEnryptedPassword.error, status: 500 }
    }

    // formatting user details & user creation 

    let user_data = {
        user_name: params.user_name,
        user_email: params.user_email,
        user_password: hashEnryptedPassword,

    }

    let user_data_insert = await user.create(user_data).catch((err) => { return { error: err } })
    if (!user_data_insert & user_data_insert && user_data_insert.error) {
        return { error: user_data_insert.error, status: 500 }
    }

    //formatting user permission

    let user_permission_Data = {
        u_id: user_data_insert.id,
        p_id: 1
    }

    let user_permission_insert = await user_permission.create(user_permission_Data).catch((err) => { return { error: err } })

    if (!user_permission_insert || user_permission_insert && user_permission_insert.error) {

        //Deleting user from user table if bydefault roles are not assigned

        user_delete = await user.destroy({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
        if (user_delete && user_delete.error) {
            return { error: "connect to Admin", status: 500 }
        }

        return { error: "Something went wrong kindly try again", status: 500 }

    }

    return { data: user_data_insert, status: 201 }


}


//// login 

async function verifyLogin(params) {

    let schema = joi.object({
        user_email: joi.string().min(5).max(30).email().required(),
        user_password: joi.string().min(5).max(20).required()

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

async function modellogin(params) {

    let check = await verifyLogin(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check if user already exist 

    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    if (!find_email) {
        return { error: 'Please register yourself first', status: 404 }
    }
    else if (find_email && find_email.error) {
        return { error: 'Internal Server Error, please try again', status: 500 }
    }

    // comparing password 
    let comparePass = await security.compare(params.user_password, find_email.user_password).catch((error) => { error })
    if (!comparePass) {
        return { error: 'Please enter valid password', status: 401 }
    }
    else if (comparePass && comparePass.error) {
        return { error: comparePass.error, status: 500 }
    }

    //generating token
    let tokenKey = "Shootingstars_@$786"
    // console.log(find_email)
    let token = await security.encryptJWT({ id: find_email.id }, tokenKey).catch((err) => { return { error: err } })
    if (!token || (token && token.error)) {
        return { error: token.error, status: 500 }
    }

    //updating token in database
    let updateToken = await user.update({ user_token: token }, { where: { user_email: find_email.user_email } }).catch((err) => { return { error: err } })
    if (!updateToken || (updateToken && updateToken.error)) {
        return { error: updateToken.error, status: 500 }
    }



    return { data: find_email.user_name, token, status: 200 }

}


//forget password 

//user data verification 

async function verifyForgetPass(params) {

    let schema = Joi.object({
        user_email: joi.string().min(5).max(30).email().required()
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

async function modelForgetPassword(params) {

    let check = await verifyForgetPass(params).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    // check if email exist in DB

    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    if (!find_email || (find_email && find_email.error)) {
        return { error: "No user found", status: 404 }
    }

    let otp = randomstring.generate({ length: 4, charset: "numeric" })
    // console.log(otp)
    let otp_encrypt = await security.hash(otp).catch((err) => { return { error: err } })
    if (!otp_encrypt || (otp_encrypt && otp_encrypt.error)) {
        return { error: otp_encrypt.error, status: 500 }
    }

    let update_otp = await user.update({ user_otp: otp_encrypt }, { where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    if (!update_otp || (update_otp && update_otp.error)) {
        return { error: update_otp.error, status: 500 }
    }

    let mailoptions = {
        from: 'poolking90zeeshan90@gmail.com',
        to: find_email.user_email,
        subject: 'Password Reset OTP',
        text: `Please find enter below OTP to reset your password ${otp}`,
        // html: '<h1>Test from HTML</h1>'
    }

    let otpMailSend = nodeMailer.sendEmail(mailoptions).catch((err) => { return { error: err } })
    if (otpMailSend && otpMailSend.error) {
        return { error: otpMailSend.error, status: 500 }
    }


    return { data: "OTP has been sent to your Email ID", status: 200 }

}


//password reset 

// user data verification

async function verifyResetPasswod(params) {
    let schema = joi.object({
        user_email: joi.string().min(5).max(30).email().required(),
        otp: joi.string().required(),
        new_password: joi.string().min(5).max(20).required(),
        confirm_password: joi.string().min(5).max(20).required()

    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((err) => { return { error: err } })
    if (valid && valid.error) {
        let msg = [];
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }

}

async function modelResetPassword(params) {
    let check = await verifyResetPasswod(params).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }


    //check user exist in DB or not 
    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    if (!find_email) {
        return { error: 'No User Found', status: 404 }
    }
    else if (find_email && find_email.error) {
        return { error: 'Internal Server Error, please try again', status: 500 }
    }

    //compare OTP
    let compare_otp = await security.compare(params.otp, find_email.user_otp).catch((error) => { return { error } })
    // console.log(compare_otp)
    if (!compare_otp || (compare_otp && compare_otp.error)) {
        return { error: "Kindly provide correct OTP", status: 409 }
    }

    if (params.new_password != params.confirm_password) {
        return { error: "Password doesn't match", status: 409 }
    }

    //hash password 
    let hashEnryptedPassword = await security.hash(params.new_password).catch((err) => { return { error: err } })
    if (!hashEnryptedPassword || (hashEnryptedPassword && hashEnryptedPassword.error)) {
        return { error: "Internal Server Error", status: 500 }
    }

    //update hased passowrd in DB
    let updateNewPassword = await user.update({ user_password: hashEnryptedPassword }, { where: { user_email: find_email.user_email } }).catch((err) => { return { error: err } })

    if (!updateNewPassword || (updateNewPassword && updateNewPassword.error)) {
        return { error: "Internal Server Error", status: 500 }
    }

    //update token to null
    let updateTokenToNull = await user.update({ user_token: "" }, { where: { user_email: find_email.user_email } }).catch((err) => { return { error: err } })

    if (!updateTokenToNull || (updateTokenToNull && updateTokenToNull.error)) {
        return { error: 'internal Server Error', status: 500 }
    }

    return { data: "Password has been reset successfully", status: 200 }
}

//password change 

async function verifyPasswordChange(params) {
    let schema = joi.object({
        user_password: joi.string().min(5).max(20).required(),
        new_password: joi.string().min(5).max(20).required()
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

async function modelPasswordChange(params, userData) {
    let check = await verifyPasswordChange(params).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check whether user exist in DB or not 
    let find_user = await user.findOne({ where: { Id: userData.id } }).catch((err) => { return { error: err } })
    // console.log(userData)
    if (!find_user) {
        return { error: "No User Found", status: 404 }
    }
    else if (find_user.error) {
        return { error: "Internal Server Error", status: 500 }

    }


    //compare DB password with user provided password 

    let comparePassword = await security.compare(params.user_password, find_user.user_password).catch((err) => { return { error: err } })
    // console.log(comparePassword)
    // console.log(params.user_password)
    // console.log(find_user.user_password)
    if (!comparePassword) {
        return { error: 'Please enter valid password', status: 409 }
    }

    else if (comparePassword && params.user_password === params.new_password) {
        return { error: 'Not allow to change to old password, please provide different password', status: 409 }
    }

    else if (comparePassword && comparePassword.error) {
        return { error: comparePass.error, status: 500 }
    }



    //hash new password    
    let hashpassword = await security.hash(params.new_password).catch((err) => { return { error: err } })
    if (!hashpassword || (hashpassword && hashpassword.error)) {
        return { error: hashpassword.error, status: 500 }
    }

    //update new hashed password in DB
    let updateNewPassword = await user.update({ user_password: hashpassword }, { where: { user_email: find_user.user_email } }).catch((err) => { return { error: err } })
    if (!updateNewPassword || (updateNewPassword && updateNewPassword.error)) {
        return { return: updateNewPassword.error, status: 500 }
    }

    return { data: "Password has been changed successfully", status: 200 }

}

//get user list

//user data verification 
async function verifyViewUser(params) {
    let schema = joi.object({
        Id: joi.number(),
        user_name: joi.string().min(5).max(20),
        user_email: joi.string().min(5).max(30).email()
    })

    let valid = await schema.validateAsync(params).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }
}

async function modelViewUser(params) {
    let check = await verifyViewUser(params, { abortEarly: false }).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //format Where clause 
    let query = {}
    if (params.Id) {
        query = { where: { Id: params.Id } }
    }

    else if (params.user_name) {
        query = { where: { user_name: params.user_name } }
    }

    else if (params.user_email) {
        query = { where: { user_email: params.user_email } }
    }

    //get user list 
    let allUserData = await user.findAll(query).catch((err) => { return { error: err } })
    if (!allUserData || (allUserData && allUserData.error)) {
        return { error: allUserData.error, status: 500 }
    }
    return { data: allUserData, status: 200 }
}


//delete user 

async function verifyDeleteUser(params) {
    let schema = joi.object({
        user_email: joi.string().min(5).max(30).email().required()
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

async function modelDeleteUser(params) {
    let check = await verifyDeleteUser(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check user exist in DB or not 
    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    // console.log (find_email)
    if (!find_email) {
        return { error: "No User Found", status: 404 }
    }

    else if (find_email && find_email.error) {
        return { error: find_email.error, status: 500 }
    }

    // check if user is already deleted
    let is_deleted = find_email.is_deleted
    // console.log(find_email.is_deleted)
    if (is_deleted == 1) {
        return { error: "User is already deleted", status: 409 }
    }


    //delete user 
    let delete_user = await user.update({ is_deleted: 1 }, { where: { user_email: find_email.user_email } }).catch((err) => { return { error: err } })
    // console.log(delete_user)
    if (!delete_user || (delete_user && delete_user.error)) {
        return { error: delete_user.error, status: 500 }
    }

    return { data: "User has been deleted", status: 200 }
}

//undelete user 

async function verifyRestoreUser(params) {
    let schema = joi.object({
        user_email: joi.string().min(5).max(30).email().required()
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


async function modelRestoreUser(params) {
    let check = await verifyRestoreUser(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    //check user exist in DB or not 
    let find_email = await user.findOne({ where: { user_email: params.user_email } }).catch((err) => { return { error: err } })
    // console.log (find_email)
    if (!find_email) {
        return { error: "No User Found", status: 404 }
    }

    else if (find_email && find_email.error) {
        return { error: find_email.error, status: 500 }
    }

    //check user active or not 

    let is_deleted = find_email.is_deleted
    if (is_deleted == 0) {
        return { error: "User is already Active in the system", status: 409 }
    }


    //restore_user 
    let restore_user = await user.update({ is_deleted: 0 }, { where: { user_email: find_email.user_email } }).catch((err) => { return { error: err } })
    // console.log(restore_user)
    if (!restore_user || (restore_user && restore_user.error)) {
        return { error: restore_user.error, status: 400 }
    }

    return { data: "User's profie has been Activated", status: 200 }
}

//update user's profile
async function verifyUpdateProfile(params) {
    let schema = joi.object({
        user_name: joi.string().min(5).max(20),
        user_email: joi.string().min(5).max(30).email()
    })

    let valid = await schema.validateAsync(params).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }
}



async function modelUpdateProfile(params, userData) {
    let check = await verifyUpdateProfile(params, { abortEarly: false }).catch((err) => { return { error: err } })
    // console.log(check)
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    if (!params.user_name && !params.user_email) {
        return { error: "Please provide user_name or user_email field to update the value", status: 400 }
    }

    //check user exist in DB or not 
    let find_email = await user.findOne({ where: { Id: userData.id } }).catch((err) => { return { error: err } })
    // console.log(find_email)
    if (!find_email) {
        return { error: "No User Found", status: 404 }
    }

    else if (find_email && find_email.error) {
        return { error: find_email.error, status: 500 }
    }

    //update profile
    let updateProfile = await user.update(params, { where: { Id: find_email.id } }).catch((err) => { return { error: err } })
    // console.log(updateProfile)
    if (!updateProfile || (updateProfile && updateProfile.error)) {
        return { error: 'Internal Server Error', status: 500 }
    }

    return { data: "Profile has been updated.", status: 200 }
}


async function verifyLogout(param) {
    let schema = joi.object({
        token: joi.string().required()
    })

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((error) => { return { error } })

    if (!valid || (valid && valid.error)) {
        let msg = []
        for (i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }

    return { data: valid }
}


async function modelLogout(param) {
    let check = await verifyLogout(param).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    // decryt token

    let valid_user = await dcryptJWT(param.token).catch((error) => { return { error } })
    if (!valid_user || (valid_user && valid_user.error)) {
        return { error: valid_user.error, status: 500 }
    }

    //update token to null

    let logout = await user.update({ user_token: '' }, { where: { Id: valid_user.id } }).catch((error) => { return { error } })
    if (!logout || (logout && logout.error)) {
        return { error: logout.error, status: 500 }
    }

    return { data: "Logged Out", status: 200 }
}

module.exports = { modelRegister, modellogin, modelForgetPassword, modelResetPassword, modelPasswordChange, modelViewUser, modelDeleteUser, modelRestoreUser, modelUpdateProfile, modelLogout }



