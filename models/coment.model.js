const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    post: { type: Schema.ObjectId, ref: 'post' },
    user: { type: Schema.ObjectId, ref: 'user' },
    coment: { type: String, required: true },
    state: { type: Boolean, default: true }
})

const Coment = mongoose.model('coment', schema);

module.exports = Coment;