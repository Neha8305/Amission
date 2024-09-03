const userModel = require('../models/Users')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
const CourseModal = require('../models/course')


cloudinary.config({ 
  cloud_name: 'dywvtdtpy', 
  api_key: '655265211765838', 
  api_secret: 'mN7DrgpBMlhqLzFxIOreh5gRJFE' ,
  secure:false
});

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static dashboard = async (req, res) => {
    try {
      const { name, image, email, _id } = req.user;
      const btech = await CourseModal.findOne({
        userid: _id,
        course: "BTECH",
      });
      const mba = await CourseModal.findOne({
        userid: _id,
        course: "MBA",
      });
      const mca = await CourseModal.findOne({
        userid: _id,
        course: "MCA",
      });
      res.render("dashboard", {
        n: name,
        i: image,
        e: email,
        b: btech,
        m: mca,
        m: mba,
        message: req.flash("error") 
      });
    } catch (error) {
      console.log(error);
    }
  };
  static createUser = async (req, res) => {
    const imageFile = req.files.image;
    const imageUpload = await cloudinary.uploader.upload(
      imageFile.tempFilePath,
      {
        folder: "profileImage",
      }
    );
    // console.log(imageUpload)
    const { name, email, password, confirm_password,} = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "email already exist");
      res.redirect("/register");
    } else {
      if (name && email && password && confirm_password) {
        if (password === confirm_password) {
          try {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
              name: name,
              email: email,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            
            });
            await newUser.save();
            res.redirect("/");
          } catch (error) {
            console.log(error);
          }
        } else {
          req.flash("error", "Password not match");
          res.redirect("/register");
        }
      } else {
        req.flash("error", "All field are required");
        res.redirect("/register");
      }
    }
  };
  static verifylogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await userModel.findOne({
          email: email,
        });
        if (user != null) {
          const ismatched = await bcrypt.compare(password, user.password);
          if (ismatched) {
            if (user.role == "user") {
              //gennerate token
              const token = jwt.sign(
                {
                  id: user._id,
                },
                "saurabh123"
              );
              res.cookie("token", token);
              res.redirect("/dashboard");
            }
            if (user.role == "admin") {
              //gennerate token
              const token = jwt.sign(
                {
                  id: user._id,
                },
                "saurabh123"
              );
              res.cookie("token", token);
              res.redirect("/admin/display");
            }
          } else {
            req.flash("error", "Email and Password is not matched");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a Registered User");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All field are required");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image, _id } = req.user;

      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image, _id } = req.user;

      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, _id, email } = req.user;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        message: req.flash("error"),
        message2: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static changepassword = async (req, res) => {
    try {
      const { name, image, _id, email } = req.user;
      const { old_password, new_password, confirm_password } = req.body;
      if (old_password && new_password && confirm_password) {
        const user = await userModel.findById(_id);
        const ismatched = await bcrypt.compare(old_password, user.password);
        if (!ismatched) {
          req.flash("error", "Old password is not matched");
          res.redirect("/profile");
        } else {
          if (new_password !== confirm_password) {
            req.flash(
              "error",
              "password and confirm password does not matched"
            );
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(new_password, 10);
            await userModel.findByIdAndUpdate(_id, {
              $set: { password: newHashPassword },
            });
            req.flash("success", " password changed successfully");
            res.redirect("/profile");
          }
        }
      } else {
        req.flash("error", "All field are required");
        res.redirect("/profile");
      }
      // console.log(req.body);
    } catch (error) {
      console.log(error);
    }
  };

  static updateprofile = async (req, res) => {
    try {
      const { name, image, _id, email } = req.user;
      console.log(req.files.image);
    } catch (error) {
      console.log(error);
    }
  };
  static sendMailForRestPassword = async (name, email, randmSrt) => {
    try {
      var transporter = await nodemailer.createTransport({
        // service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "saurabhpb09@gmail.com",
          pass: "xiyrfixmiwngwmyf",
        },
      });
      var mailOptions = {
        from: "codexbay18@gmail.com",
        to: email,
        subject: `courses ${status}`,
        text: "That was easy!",
        html: `<p> hi ${name} please click here to <a href="http://127.0.0.1:4000/forgot_password?id = ${_id}"> Forgot </a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  static forgotPass = async (req, res) => {
    try {
      res.render("forgotPass");
    } catch (error) {
      console.log(error);
    }
  };

  static forgotVerify = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await userModel.findOne({ email: email });
      if (user) {
        if (user.isverified === 0) {
          res.render("forgotPass", { message: "Please verify your Email" });
        } else {
          const randomStr = randomString.generate();
          const updatedData = await user.updateOne(
            { email: email },
            { $set: { randmSrt: randomStr } }
          );
          this.sendMailForRestPassword(user.name, user.email, randomStr);
          res.render("forgotPass", {
            message: "please check your mail to reset password ",
          });
        }
      } else {
        res.render("forgotPass", { message: "Email is invalid" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static forgetPassword = async (req, res) => {
    try {
      const randmSrt = req.query.randmSrt
      const tokenData = await user.findOne({
        randmSrt:randmSrt
      })
      if (tokenData) {
        res.render('forget_password',{message:"token is invalid"})
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifymail = async (req, res) => {
    try {
      const updateInfo = await user.updateOne(
        { _id: req.query.id },
        { $set: { isverified: 1 } }
      );
      res.render("emailVerified");
    } catch (error) {
      console.log(error);
    }
  };
}




module.exports = FrontController