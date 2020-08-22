const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = function(req, res){
    // console.log(req.cookies)
    // res.cookie('user_id', 25);
    // Post.find({}, function(err, posts){
    //     if (err){console.log("There's an error while fetching the Posts."); return;}
    //     return res.render('home', {
    //         title: 'Home',
    //         posts: posts
    //     })
    // })
    
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        if (err){console.log("There's an error while fetching the Posts."); return;}
        User.find({}, function(err, users){
            if (err){console.log("There's an error while fetching the Posts."); return;}
            return res.render('home', {
                title: 'Home',
                posts: posts,
                all_users: users,
            })
        })
        
    })
}


