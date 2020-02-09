const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    Following: { type: Schema.ObjectId, ref: 'user' },
    follower: { type: Schema.ObjectId, ref: 'user' },
    state: { type: Boolean, default: true }
})

const Follow = mongoose.model('follow', schema);

module.exports = Follow;