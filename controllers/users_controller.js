const User = require('../models/user');
const fs = require('fs');
const path = require("path");
const ForgotPassword = require("../models/forget_password");
const { db } = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err){console.log("There's an error fetching Friend's Profile"); return;}
        return res.render('users', {
            title: 'Users',
            user_profile: user,
        })
    })
}

module.exports.update = async function(req, res){
    // if (req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         if (err){console.log("There's an error while updating Credentials."); return;}
    //         return res.redirect('/');
    //     });
    // }else{
    //     return res.status(401).send("Unauthorized.");
    // }
    if (req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err){
                    console.log("Error handling multer"); return;
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){
                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash("success", "Credentials changed Successfully!");
                return res.redirect('back');
            })
        }catch(err){
            req.flash("error", "There's an error while updating the User Credentials.");
            return res.redirect('back');
        }
    }
}

module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }else{
        return res.render('user_sign_up', {
            title: 'Codeial | Sign Up'
        });
    }
}

module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }else{
        return res.render('user_sign_in', {
            title: 'Codeial | Sign In'
        })
    }
}

// module.exports.create = function(req, res){
//     if (req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }
//     User.findOne({email: req.body.email}, function(err, user){
//         if (err){console.log("There's an error while finding the user in the database."); return}
//         if (!user){
//             User.create(req.body, function(err, user){
//                 if (err){console.log("There's an error while adding the user."); return}
//                 return res.redirect('/users/sign-in');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     })
// }

module.exports.create = async function(req, res){
    try{
            if (req.body.password != req.body.confirm_password){
                return res.redirect('back');
            }
            let user = await User.findOne({email: req.body.email});
            if (!user){
                await User.create(req.body)
                return res.redirect('/users/sign-in');
            }else{
                return res.redirect('back');
            }
    }catch(err){
        console.log("There's an error while creating the User Account");
        return;
    }
}

module.exports.createSession = function(req, res){
    req.flash("success", "Successfully Signed in.");
    return res.redirect('/');
}
 
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged off.");
    return res.redirect('/');
}

module.exports.forgetPassword = function(req, res){
    return res.render('forgot_password', {
        title: "Forget Password",
    });
}

module.exports.recoveryEmail = function(req, res){
    User.findOne({email: req.body.recovery_email}, function(err, user){
        if (err){console.log("Error finding user while changing password"); return;}
        if (!user){
            console.log("The account by this email does not exist.");
            return res.redirect("back");
        }
        if (user){
            console.log("Redirecting you to password changing page.");
            return res.redirect("/users/reset-password");

        }
    })
}

module.exports.resetPassword = function(req, res){
    return res.render("reset_password", {
        title: "Reset Password"
    });
}

module.exports.changedPassword = async function(req, res){
    if (req.body.new_password != req.body.confirm_new_password){
        console.log("Password does not match with confirm password, try again");
        return res.redirect('back');
    }
    else{
        let user = await User.findOne({email: req.body.recovery_email});
        user.password = req.body.new_password;
        user.save();
        return res.redirect('/users/sign-in');
    }


}

module.exports.index = async function(req, res){
    let user = await User.find({})
    return res.json(200, {
        message: "User Credentials",
        user: user,
    })
}