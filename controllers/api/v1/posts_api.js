const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
    .populate('user')
    .sort('-createdAt')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.json(200, {
        message: 'List of Posts',
        posts: posts,
    });
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        post.remove();
        await Comment.deleteMany({post: req.params.id});

        return res.json(200, {
            message: "Post Deleted Successfully."
        })
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Error deleting the Post.",
        })
    }
}