const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    image: { type: String },
    verified: { type: Boolean, default: false },
    code: { type: Number, required: true },
    created: { type: Date, default: Date.now },
    state: { type: Boolean, default: true }
})

const User = mongoose.model('user', schema);

module.exports = User;