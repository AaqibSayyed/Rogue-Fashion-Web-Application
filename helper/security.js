const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


async function hash(plainText, saltRounds=10) {
    const encryptedPassowrd = await bcrypt.hash(plainText, saltRounds).catch((err) => { return {error:err} })
        return encryptedPassowrd
}


async function compare(plainText, encryptedPassowrd) {

    const decryptedPass = bcrypt.compare(plainText, encryptedPassowrd).catch((err) => { return {error:err} })
        return decryptedPass
}


function encryptJWT(plainText, key = "Shootingstars_@$786") {
    return new Promise((res, rej) => {

        jwt.sign(plainText, key, ((err, encrtyptedDataJWT) => {
            if (err) {
                rej(err)
            }
            {
                res(encrtyptedDataJWT)
            }

        }))

    }
    )
}



function dcryptJWT(enryptedPassword, key = "Shootingstars_@$786") {
    return new Promise((res, rej) => {
        jwt.verify(enryptedPassword, key, ((err, dcryptedDataJWT) => {

            if (err) {

                rej(err)
            }

            else {

                res(dcryptedDataJWT)

            }
        }))
    })
}


module.exports = { hash, compare, encryptJWT, dcryptJWT  };