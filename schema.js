const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'addresses'
    }
});

const User = mongoose.model('users', userSchema);

const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
});

const Address = mongoose.model('addresses', addressSchema);

module.exports = { User, Address }