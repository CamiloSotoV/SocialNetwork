const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    description: { type: String },
    images: [{
        images: { type: String, unique: true }
    }],
    likes: { type: Number, default: 0 },
    coments: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Post = mongoose.model('post', schema);

module.exports = Post;