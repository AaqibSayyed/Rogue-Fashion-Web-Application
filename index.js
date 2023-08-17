const express = require('express')
const app = express()


const mainRouter = require ('./route.js')

app.use(express.json())

app.use(mainRouter)

app.use('/public',express.static('public'))


app.listen(5000,()=>{
    console.log('listening on port 5000...')
})