const jwt = require("jsonwebtoken");
const usermodal = require('../models/Users')

async function isAdmin(req, res, next) {
  // Get the token from the request cookies
   const { token } = req.cookies;
   if (!token) {
     req.flash("error", "unauthorised user, please login!");
     return res.redirect("/");
   } else {
     const verifyToken = jwt.verify(token, "saurabh123");
     const data = await usermodal.findOne({
       _id: verifyToken.id,
     });
        if (data.role == "admin") {
            req.user = data;
          next(); // Allow access to the admin route
        } else {
          req.flash("error", "unauthorised user, You can't access it...");
            return res.redirect("/dashboard"); 
        }
    }
    
  
}


module.exports = isAdmin;