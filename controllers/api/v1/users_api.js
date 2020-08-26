const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if (!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid Credentials, try again"
            });
        }
        return res.json(200,{
            message: "Here's your Key, keep it safely!",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '10000'})
            }
        })
    }catch(err){
        console.log("error******* ", err);
        return res.json(500, {
            message: "Error while implementing passport-jwt",
        })
    }
}