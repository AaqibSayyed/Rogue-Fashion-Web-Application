const model_auth = require('../model/auth');


async function registerController(req, res) {
    let registercheck = await model_auth.modelRegister(req.body).catch((err) => { return { error: err } })
    // console.log('registercheck',registercheck)
    // console.log(`i am from body ${req.body.user_name}`)
    if (!registercheck || (registercheck && registercheck.error)) {
        return res.status(registercheck.status).send({ error: registercheck.error })
    }
    return res.status(registercheck.status).send({ data: `Registration has been done. Thank you ${registercheck.data.user_name}` })

}



async function loginController(req, res) {

    let loginCheck = await model_auth.modellogin(req.body).catch((err) => { return { error: err } })
    // console.log(loginCheck)
    // console.log(loginCheck.token)

    if (!loginCheck || (loginCheck && loginCheck.error)) {
        return res.status(loginCheck.status).send({ error: loginCheck.error })
    }
    // res.cookie('JWT', loginCheck.token, {expires: new Date(Date.now() + 1000 * 60 * 15)})

    return res.status(loginCheck.status).send({ data: loginCheck.data, token: loginCheck.token })



}


async function forgetPasswordController(req, res) {
    let forgetpasswordcheck = await model_auth.modelForgetPassword(req.body).catch((err) => { return { error: err } })
    // console.log(forgetpasswordcheck)
    if (!forgetpasswordcheck || (forgetpasswordcheck && forgetpasswordcheck.error)) {
        return res.status(forgetpasswordcheck.status).send({ error: forgetpasswordcheck.error })
    }

    return res.status(forgetpasswordcheck.status).send({ data: forgetpasswordcheck.data })
}



async function resetPasswordController(req, res) {
    let resetPasswordcheck = await model_auth.modelResetPassword(req.body).catch((err) => { return { error: err } })
    // console.log(resetPasswordcheck)
    if (!resetPasswordcheck || (resetPasswordcheck && resetPasswordcheck.error)) {
        return res.status(resetPasswordcheck.status).send({ error: resetPasswordcheck.error })
    }

    return res.status(resetPasswordcheck.status).send({ data: resetPasswordcheck.data })

}


async function passwordChangeController(req, res) {
    let passwordChangeCheck = await model_auth.modelPasswordChange(req.body, req.userData).catch((err) => { return { error: err } })
    // console.log(req.userData)
    if (!passwordChangeCheck || (passwordChangeCheck && passwordChangeCheck.error)) {
        return res.status(passwordChangeCheck.status).send({ error: passwordChangeCheck.error })
    }

    return res.status(passwordChangeCheck.status).send({ data: passwordChangeCheck.data })
}


async function viewUserController(req, res) {
    let viewUserCheck = await model_auth.modelViewUser(req.body).catch((err) => { return { error: err } })
    // console.log(viewUserCheck)
    if (!viewUserCheck || (viewUserCheck && viewUserCheck.error)) {
        return res.status(viewUserCheck.status).send({ error: viewUserCheck.error })
    }

    return res.status(viewUserCheck.status).send({ data: viewUserCheck.data })
}


async function deleteUserController(req, res) {
    let deleteUserCheck = await model_auth.modelDeleteUser(req.body).catch((err) => { return { error: err } })
    // console.log(deleteUserCheck)
    if (!deleteUserCheck || (deleteUserCheck && deleteUserCheck.error)) {
        return res.status(deleteUserCheck.status).send({ error: deleteUserCheck.error })
    }

    return res.status(deleteUserCheck.status).send({ data: deleteUserCheck.data })
}


async function restoreUserController(req, res) {
    let restorDeleteUserCheck = await model_auth.modelRestoreUser(req.body).catch((err) => { return { error: err } })
    // console.log(restorDeleteUserCheck)
    if (!restorDeleteUserCheck || (restorDeleteUserCheck && restorDeleteUserCheck.error)) {
        return res.status(restorDeleteUserCheck.status).send({ error: restorDeleteUserCheck.error })
    }

    return res.status(restorDeleteUserCheck.status).send({ data: restorDeleteUserCheck.data })
}


async function updateProfileController(req, res) {
    let updateProfileCheck = await model_auth.modelUpdateProfile(req.body, req.userData).catch((err) => { return { error: err } })
    // console.log(updateProfileCheck)
    if (!updateProfileCheck || (updateProfileCheck && updateProfileCheck.error)) {
        return res.status(updateProfileCheck.status).send({ error: updateProfileCheck.error })
    }

    return res.status(updateProfileCheck.status).send({ data: updateProfileCheck.data })

}

async function logoutController(req, res) {
    // let token = req.cookies.JWT
    // console.log('req.headers',req.headers['authorization'])
    // console.log('req.headers',req.headers)

    let token = req.headers.authorization.split(' ')[1]
    let params = { token }
    // console.log('params',params)
    let logout_Check = await model_auth.modelLogout(params).catch((err) => { return { error: err } })
    // console.log(logout_Check)

    if (!logout_Check || (logout_Check && logout_Check.error)) {
        return res.status(logout_Check.status).send({ error: logout_Check.error })
    }

    // res.cookie("JWT", '', {expires: new Date(0)})
    // // res.clearCookie("JWT");
    // return res.cookie('JWT', '', {maxAge: 0,overwrite: true})
    // console.log('logout_Check.data', logout_Check.data)

    return res.status(logout_Check.status).send({ data: logout_Check.data })


}

module.exports = { registerController, loginController, forgetPasswordController, resetPasswordController, passwordChangeController, viewUserController, deleteUserController, restoreUserController, updateProfileController, logoutController }



