const CourseModel = require("../../models/course");
const nodemailer = require('nodemailer')

class AdminController {
  static display = async (req, res) => {
    try {
      const { name, image, _id } = req.user;
      const data = await CourseModel.find();
      res.render("admin/display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static courseview = async (req, res) => {
    try {
      const { name, image, _id } = req.user;
      const data = await CourseModel.findById(req.params.id);
      res.render("admin/view", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static updatestatus = async (req, res) => {
    try {
      const { name, image, _id, email, status,comment } = req.user;
      const data = await CourseModel.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment,
        status: req.body.status,
      });
     req.flash("success", "status update successfully");
    //  this.sendMail(name, email, status, comment);
     res.redirect("/admin/display");
    } catch (error) {
      console.log(error);
    }
  };
  static sendMail = async (name, email, status, comment) => {
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
        html: `<b> ${name}</b> course <b> ${status} </b> successful <br>
      <b>comment from admin</b> ${comment}`,
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
}
module.exports = AdminController;
