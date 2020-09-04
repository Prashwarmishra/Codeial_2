const nodemailer = require("../config/nodemailer");

exports.newComment = (comment) => {
    let HTMLstring = nodemailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from: "admin@codeial.com",
        to: comment.user.email,
        subject: "Comment Added",
        html: HTMLstring
    }, (err, info) => {
        if (err){
            console.log("Error in sending mail: ", err);
            return;
        }console.log("Mail sent: ", info);
        return;
    })
}