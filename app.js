//jshint esversion:6

require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express()

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]})


const User = new mongoose.model("User", userSchema)


app.route("/")
.get((req,res)=>{
    res.render("home")
})

app.route("/login")
.get((req, res)=>{
    res.render("login")
})
.post((req,res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}).then((err)=>{
        if (err === null){
            console.log("sumting wong")
        }else {
            if(err.password === password ){
                res.render("secrets")
            }else{
                console.log("incorrect username or password", err)
            }
        }
    })
})

app.route("/register")
.get((req, res)=>{
    res.render("register")
})
.post((req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then((err)=>{
        if(err === null){
            console.log("sunting wong")
        } else{
            res.render("secrets")
        }
    })
})

app.listen(3000, ()=>{
    console.log("server has started on port 3000")
})