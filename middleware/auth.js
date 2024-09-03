const jwt = require('jsonwebtoken')
const usermodal = require("../models/Users")
const courseModel = require('../models/course')

const ChechUserAuth = async(req,res,next) =>{
    // console.log("hello user")
const jwt = require('jsonwebtoken')
    const {token} = req.cookies
    if(!token){
        req.flash('error','unauthorised user, please login!')
        return res.redirect('/')
    }
    else{
        const verifyToken = jwt.verify(token,'saurabh123')
        const data = await usermodal.findOne({
            _id: verifyToken.id
        })
        req.user = data
        next()
    }

}



module.exports = ChechUserAuth;