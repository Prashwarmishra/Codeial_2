const Post = require('../models/post');
const Comment = require('../models/comment');

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
        await Post.create({
            content: req.body.content,
            user: req.user._id
        })
        return res.redirect('back');
    }
    catch(err){
        console.log("There's an error creating the Post"); return;
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
            post.remove();
            await Comment.deleteMany({post: req.params.id})
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error deleting the Post."); 
        return;
    }
    
}