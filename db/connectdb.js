const mongoose = require('mongoose')
const url = "mongodb+srv://neha90:Ardhnari9090@admission.6dkcx.mongodb.net/?retryWrites=true&w=majority&appName=Admission";

const connectdb=()=>{
    return mongoose.connect(url)
    .then(()=>{
        console.log("Connected Succeessfully")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports=connectdb