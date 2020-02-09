const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    post: { type: Schema.ObjectId, ref: 'post' },
    user: { type: Schema.ObjectId, ref: 'user' },
    state: { type: Boolean, default: true }
})

const Like = mongoose.model('like', schema);

module.exports = Like;