const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
    isVerified: { type: Boolean, required: false }
});

module.exports = mongoose.model('User', userSchema);