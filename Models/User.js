const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String, index: true, required: [true, "Can't be blank"]},
    lastName: {type: String, index: true, required: [true, "Can't be blank"]},
    email: {type: String, index: true, required: [true, "Can't be blank"]},
    password: String
}, {timestamps: true})

const userModel = mongoose.model('User', userSchema, 'user');

module.exports = userModel;
