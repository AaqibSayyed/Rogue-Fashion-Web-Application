const model_auth = require('../model/auth');


async function registerController(req, res) {
    let registercheck =  await model_auth.modelRegister(req.body).catch((err)=>{return {error: err}})
    // console.log(registercheck)
    // console.log(`i am from body ${req.body.user_name}`)

        if (!registercheck || (registercheck && registercheck.error)){
            return res.status(400).send({error: registercheck.error})
        }
        return res.send({data: `Registration has been done. Thank you ${registercheck.data.user_name}`})
    
}


async function loginController(req, res) {

    let loginCheck = await model_auth.modellogin(req.body).catch((err) => { return { error: err } })
    // console.log(loginCheck)
    console.log(loginCheck.token)

    if (!loginCheck || (loginCheck && loginCheck.error)) {
        return res.status(400).send({ error: loginCheck.error })
    }

    return res.send ({data: `Hi ${loginCheck.data}, You are logged in now. Token is ${loginCheck.token}`}  )

    
}


async function forgetPasswordController(req, res){
    let forgetpasswordcheck = await model_auth.modelForgetPassword(req.body).catch((err)=>{return {error: err}})
        // console.log(forgetpasswordcheck)
        if (!forgetpasswordcheck || (forgetpasswordcheck && forgetpasswordcheck.error)){
            return res.status(400).send({error: forgetpasswordcheck.error})
        }

        return res.send ({data: forgetpasswordcheck.data})
}



async function resetPasswordController(req, res){
    let resetPasswordcheck = await model_auth.modelResetPassword(req.body).catch((err)=>{return {error: err}})
    console.log(resetPasswordcheck)

        if (!resetPasswordcheck || (resetPasswordcheck && resetPasswordcheck.error)){
            return res.status(400).send({error: resetPasswordcheck.error})
        }

        return res.send({data: resetPasswordcheck.data})

}


async function passwordChangeController(req, res){
    let passwordChangeCheck = await model_auth.modelPasswordChange(req.body, req.userData).catch((err)=>{return {error: err}})
        // console.log(req.userData)
        if (!passwordChangeCheck || (passwordChangeCheck && passwordChangeCheck.error)){
            return res.status(400).send({error: passwordChangeCheck.error})
        }

        return res.send({data: passwordChangeCheck.data})
}


async function viewUserController(req, res){
    let viewUserCheck = await model_auth.modelViewUser(req.body).catch((err)=>{return {error: err}})
    // console.log(viewUserCheck)
        if (!viewUserCheck || (viewUserCheck && viewUserCheck.error)){
            return res.status(400).send({error: viewUserCheck.error})
        }

        return res.send({data: viewUserCheck.data})
}   


async function deleteUserController(req, res){
    let deleteUserCheck = await model_auth.modelDeleteUser(req.body).catch((err)=>{return {error: err}})
    console.log(deleteUserCheck)
        if (!deleteUserCheck || (deleteUserCheck && deleteUserCheck.error)){
            return res.status(400).send({error: deleteUserCheck.error})
        }

        return res.send({data: deleteUserCheck.data})
}


async function unDeleteUserController(req, res){
    let unDeleteUserCheck = await model_auth.modelUndeleteUser(req.body).catch((err)=>{return {error: err}})
    console.log(unDeleteUserCheck)
        if (!unDeleteUserCheck || (unDeleteUserCheck && unDeleteUserCheck.error)){
            return res.status(400).send({error: unDeleteUserCheck.error})
        }

        return res.send({data: unDeleteUserCheck.data})
}


async function updateProfileController(req, res){
    let updateProfileCheck = await model_auth.modelUpdateProfile(req.body, req.userData).catch((err)=>{return {error: err}})
        // console.log(updateProfileCheck)
        if (!updateProfileCheck || (updateProfileCheck && updateProfileCheck.error)){
            return res.status(400).send({error: updateProfileCheck.error})
        }

        return res.send({data: updateProfileCheck.data})

}



module.exports = { registerController, loginController, forgetPasswordController,resetPasswordController, passwordChangeController, viewUserController, deleteUserController, unDeleteUserController, updateProfileController }
    


