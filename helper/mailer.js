const nodemailer = require('nodemailer')


//connect with the SMTP server
async function sendEmail(mailoptions) {

    const transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email', 
        // host: 'smtp.gmail.com',
        // port: 587,
        // secure: false,
        service:'gmail',
        auth: {
            user: 'poolking90zeeshan90@gmail.com',
            pass: 'gtoxrouqvimucnpo'

            // user: 'joel.lindgren99@ethereal.email',
            // pass: 'zeBX7nwnJeFm9rUDne'
            
    }
    })

    // let mailoptionsss = {
    //     from: 'poolking90zeeshan90@gmail.com',
    //     to: 'sayyedaaqib007@gmail.com',
    //     subject: 'Password Reset OTP',
    //     text: `Please find below OTP to reset your password `,
    //     // html: '<h1>Test from HTML</h1>'
    // }


    let info = await transporter.sendMail(mailoptions).catch((err) => { return { error: err } })
    // console.log(info)
    if (info.error) {

        // console.log(info.error)
        return { error: info.error }
    }

}

sendEmail()

module.exports={sendEmail}