const Post = require('../models/post');
const Comment = require('../models/comment');
const commentMailer = require('../mailer/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const { post } = require('../routes/posts');

// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){
//         if (err){console.log("Error in finding the post."); return;}
//         if (post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment){
//                 if (err){console.log("There's an error while adding the Comment"); return;}
//                 post.comments.push(comment);
//                 post.save();

//                 return res.redirect('back');
//             })
//         }
//     })
// };

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post)
        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            post.comments.push(comment);
            post.save();
            comment = await comment.populate("user", "name email").execPopulate();
            //commentMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if (err){console.log("Error in implementing Kue-comment-worker: ", err); return;}

                console.log("Email comment currently being processed ...", job.id);
            });
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment,
                    }, message : 'Comment Created.'
                })
            }

            req.flash("success", "Comment added.")
            return res.redirect('back');
        }
    }catch(err){
        req.flash("error", "Error adding the Comment on the Post.");
        return res.redirect('back');
    }
};

// module.exports.destroy = function(req, res){
//     Comment.findById(req.params.id, function(err, comment){
//         if (err){console.log("Error while deleting the Comment."); return;}
//         if (comment.user == req.user.id){
            
//             let postId = comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}}, function(err, post){
//                 if (err){console.log("There's an error while updating the Post Schema"); return;}
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     })
// }
module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}});
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    }, message: 'Comment Deleted.'
                })
            }
            req.flash("success", "Comment deleted.");
            return res.redirect('back');
            }else{
                req.flash("error", "Error Deleting the Comment.");
                return res.redirect('back');
            }
        }catch(err){
            console.log('error: ', err);
            return;
        }
}