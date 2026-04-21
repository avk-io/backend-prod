const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    refreshTokenHash:{
        type:String,
        default:null
    },
    refreshMeta:{
        ip:{type: String},
        userAgent: {type: String}
    }
},{ timestamps:true })

module.exports = mongoose.model("User",userSchema)