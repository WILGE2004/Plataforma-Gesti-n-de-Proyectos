const { Schema, model } = require('mongoose');

const userModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = model('users', userModel);