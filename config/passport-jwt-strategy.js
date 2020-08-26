const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey: "codeial"
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if (err){
            console.log("Error in deploying passport-jwt");
            return done(err);
        }
        if (user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}));

module.exports = passport;