const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");
const crypto = require("crypto");

passport.use(new googleStrategy({
        clientID: "352398771212-uvg9us97k9fqcsr41skcuc5u6j5ea2e5.apps.googleusercontent.com",
        clientSecret: "vAgd7d8lXn2BNMGU-dxz4845",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    }, function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log("Error using google-strategy: ", err); return;}
            if (user){
                return done(null, user)
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log("Error creating the account using Google Strategy: "), err; return;}
                    if (user){
                        return done(null, user);
                    }
                });
            }
        })
    }
))

module.exports = passport;