const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.create = function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if (err){console.log("There's an error while adding the Post"); return;}
//         return res.redirect('back');
//     })
// }

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                }, message: 'Post Created.'
            })
        }
        req.flash('success', "Post Published!!");
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', 'Error while creating the Account');
        return res.redirect('back');
    }
}
// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id, function(err, post){
//         console.log(req.user.id);
//         console.log(post.user);
//         if (err) {console.log("There's an error while deleting the Post"); return;}

//         if (post.user == req.user.id){
            
//             post.remove();
//             Comment.deleteMany({post: req.params.id}, function(err){
//                 if (err){
//                     console.log("There's an error while deleting the comment.");
//                     return;
//                 }
//                 return res.redirect('back');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     })
// }

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id)
        if (post.user == req.user.id){
            
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();
            await Comment.deleteMany({post: req.params.id});
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    }, message: 'Post Deleted.'
                });
            }
            req.flash('success', "Post deleted Successfully.");
            return res.redirect('back');
        }
        else{
            req.flash("error", "Invalid request, unauthorized to delete the Post.")
            return res.redirect('back');
        }
    }catch(err){
        req.flash("error", "Error deleting the Post.")
        console.log("Error deleting the Post."); 
        return res.redirect('back');
    }
    
}