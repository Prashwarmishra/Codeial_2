const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({email: email}, function(err, user){
            if (err){
                req.flash("error", "There's an error while finding the user."); 
                return done(err);
            }

            if (!user || user.password != password){
                req.flash("error", "Invalid Username/Password.");
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

//Serializing the User to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
})


//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if (err){console.log("There's an error while finding the User!"); return done(err);}
        return done(null, user);
    });
});

//check if the user is authenticated

passport.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        //req.user is contains the details of the currently signed in user and we are just transferring it to the locals.user for the views
        res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;

