const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        min: 5,
        max: 1500
    },
    date: {
        type: Date,
        default: Date.now,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    user_info: {

    }
});

module.exports = mongoose.model('Comment', commentSchema);

