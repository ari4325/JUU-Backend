const mongoose = require('mongoose');
const Product = require('./Product');

const CartSchema = mongoose.Schema({
    userTag: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    items: []
});

module.exports = mongoose.model('Cart', CartSchema);