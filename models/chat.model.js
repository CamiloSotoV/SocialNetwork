const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    user_one: { type: Schema.ObjectId, ref: 'user' },
    user_two: { type: Schema.ObjectId, ref: 'user' }
});

const Chat = mongoose.model('chat', schema);

module.exports = Chat;