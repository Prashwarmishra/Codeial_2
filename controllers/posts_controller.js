const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if (err){console.log("There's an error while adding the Post"); return;}
        return res.redirect('back');
    })
}

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        console.log(req.user.id);
        console.log(post.user);
        if (err) {console.log("There's an error while deleting the Post"); return;}

        if (post.user == req.user.id){
            
            post.remove();
            Comment.deleteMany({post: req.params.id}, function(err){
                if (err){
                    console.log("There's an error while deleting the comment.");
                    return;
                }
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    })
}