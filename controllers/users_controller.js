const User = require('../models/user');
const fs = require('fs');
const path = require("path");

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