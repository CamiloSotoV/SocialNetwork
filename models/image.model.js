const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'post' },
    image: { type: String, require: true },
});

const Image = mongoose.model('image', schema);

module.exports = Image;