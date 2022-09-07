const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tag: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);