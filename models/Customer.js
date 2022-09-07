const mongoose = require('mongoose');
const Product = require('./Product');

const CustomerScheme = mongoose.Schema({
    username: {
        type: String, 
        required: true,
    },
    userTag: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('User', CustomerScheme);