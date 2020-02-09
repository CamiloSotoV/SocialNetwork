const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    chat: { type: Schema.ObjectId, ref: 'chat' },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
})

const Message = mongoose.model('message', schema);

module.exports = Message;