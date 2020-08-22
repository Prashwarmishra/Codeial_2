const Post = require('../models/post');
const Comment = require('../models/comment');
const { post } = require('../routes/posts');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if (err){console.log("Error in finding the post."); return;}
        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                if (err){console.log("There's an error while adding the Comment"); return;}
                post.comments.push(comment);
                post.save();

                return res.redirect('back');
            })
        }
    })
};

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if (err){console.log("Error while deleting the Comment."); return;}
        if (comment.user == req.user.id){
            
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}}, function(err, post){
                if (err){console.log("There's an error while updating the Post Schema"); return;}
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    })
}
