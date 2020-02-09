const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    image: { type: String, require: true },
});

const Image = mongoose.model('image', schema);

module.exports = Image;