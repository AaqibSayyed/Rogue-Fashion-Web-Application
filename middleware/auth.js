const security = require('../helper/security.js')
const { sequelize } = require('../init/dbconfig.js')

function authMiddleware(permission) {
    return async (req, res, next) => {
        if (!permission) {
            return res.send({ error: "Please provide permission" })
        }

        //checking if we get the token in header 
        if (!req.headers.token) {
            return res.status(401).send({ error: "Token not found" })
        }

        //dcrypting the token 
        let verify = await security.dcryptJWT(req.headers.token).catch((err) => { return { error: err } })
        if (!verify || (verify && verify.error)) {
            return res.status(401).send({ error: "User not found" })
        }

        let user = await sequelize.query(`select user_permission.u_id, user.user_name, user_permission.p_id, permission.permission_name  
        from user left join user_permission on user_permission.u_id = user.Id 
        left join permission on permission.id = user_permission.p_id
        where user.Id = ${verify.id} and user.user_token='${req.headers.token}'`, {type: sequelize.QueryTypes.SELECT}).catch((err)=>{return {error: err}})
        // console.log(user)
        if (!user){
            return res.status(401).send({error:"User not found"})
        }
        
        else if (user && user.error){
            return res.status(401).send({error:"Internal Server Error"})
        }

        let userPermission={}

        for (i of user){
            userPermission[i.permission_name]=1
        }

        if (!userPermission[permission]){
            return res.status(401).send({error: "Access denied"})
        }

        req.userData = {
            id:verify.id, 
            name: user[0].user_name,
            permission: userPermission
        }

        next()
        
    }


}

module.exports = {authMiddleware}

