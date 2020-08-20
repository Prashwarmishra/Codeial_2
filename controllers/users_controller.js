const User = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('users', {
        title: 'Users',
    })
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

module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if (err){console.log("There's an error while finding the user in the database."); return}
        if (!user){
            User.create(req.body, function(err, user){
                if (err){console.log("There's an error while adding the user."); return}
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    })
}

module.exports.createSession = function(req, res){
    return res.redirect('/');
}
 
module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
}