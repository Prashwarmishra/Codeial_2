const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
    }, 
    //This gives the object id of the selected element
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    }, //This gives the type of the selected object, i.e. Post or Comment
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
}, {
    timestamps: true
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;