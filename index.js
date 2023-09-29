const express = require('express')
const app = express()
const cors = require ('cors')
const cookieParser = require('cookie-parser')
const mainRouter = require ('./route.js')



app.use(cors({origin: "http://localhost:3000"}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public',express.static('public'))
app.use(mainRouter)




app.listen(5000,()=>{
    console.log('listening on port 5000...')
})