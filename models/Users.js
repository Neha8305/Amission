const mongoose = require('mongoose')
 const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
        image:{
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            },
        },
    
    role:{
        type: String,
        default:'user'
     },
    
     isverified: {
         type: Number,
         default:0
    },
    
     randmSrt: {
         type: String,
         default:''
    }
  
 },{timestamps:true})

 module.exports = mongoose.model('user',userSchema)