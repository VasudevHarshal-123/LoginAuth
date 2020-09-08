const express = require("express");
const route = express.Router();             //route = users
const cors = require("cors");
const jwtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const schema = require('../Schema');
route.use(cors());

process.env.SECRET_KEY = "secret";

route.post("/",(req,res)=>{
    console.log("HI");
    const RB = req.body;
    const dates = new Date();
    const formData = {
        photos:req.file,
        name:RB.name,
        email:RB.email,
        password:RB.password,
        role:0,
        date:dates
    }

    schema.findOne({
        email:RB.email
    })
    .then(user => {
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                formData.password = hash;
                schema.create(formData)
                .then(user => {
                    res.json({status:user.email + 'Registered'})
                })
                .catch(err=>{
                    res.send('error ' + err)
                })
            })
        }
    })
    .catch(err=>{res.send('err ' + err)}
    )
});

module.exports = route; 
