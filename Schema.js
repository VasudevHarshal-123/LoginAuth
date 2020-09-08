const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    photos:{
        data:Buffer,
        type:String
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})

module.exports = schema = mongoose.model('users',userSchema);