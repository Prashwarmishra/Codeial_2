const nodemailer = require("../config/nodemailer");

exports.newComment = (comment) => {
    console.log("Hello the contents of the mail are: ", comment)

    nodemailer.transporter.sendMail({
        from: "admin@codeial.com",
        to: comment.user.email,
        subject: "Comment Added",
        html: "<h4>Yup, your comment is added.</h4>"
    }, (err, info) => {
        if (err){
            console.log("Error in sending mail: ", err);
            return;
        }console.log("Mail sent: ", info);
        return;
    })
}