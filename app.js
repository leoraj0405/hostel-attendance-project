const express = require('express')
const app = express()

app.get('/',(req,res) =>{
    res.send('hello wolrd')
})

app.listen(1000, () =>{
    console.log('listening on port 1000')
})