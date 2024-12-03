const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user.js')
const Note = require('./models/note.js')
const userRouter = require('./routers/user.js')
const noteRouter = require('./routers/note.js')
require('dotenv').config()

const app = express()

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}));
app.use( express.static(path.join(__dirname, "public")));
app.use(express.json()) // parses incoming JSON requests and puts the parsed data in req.body
app.use(userRouter)
app.use(noteRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server started on Port 3000")
})

const url = process.env.MONGO_URL

mongoose.connect(url,(err)=>{
    if(err)
        console.log("Error connecting to cluster")
    else
        console.log("Connected...")
})

app.get('/',(req,res)=>{
    res.render('index')
})