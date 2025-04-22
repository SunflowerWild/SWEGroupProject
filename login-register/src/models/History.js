const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    partName: { type: String, required: true },
    partNumber: { type: String, required: true },
    action: { type: String, enum: ['checkout', 'return'], required: true }, // Either 'checkout' or 'return'
    timestamp: { type: Date, default: Date.now }, // Automatically set the current date and time
    user: { type: String, required: true }, // Email or name of the user
});

module.exports = mongoose.model('History', historySchema);