const Post = require('../models/post');
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
    
    Post.find({}).populate('user').exec(function(err, posts){
        if (err){console.log("There's an error while fetching the Posts."); return;}
        return res.render('home', {
            title: 'Home',
            posts: posts
        })
    })
}


