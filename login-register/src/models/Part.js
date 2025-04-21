const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    projectTag: { type: String, index: true, default: 'none' },
    isAvailable: { type: Boolean, default: true },
    checkedOut: { type: Boolean, required: true, default: false },
    type: {
        type: String,
        enum: [
            'gpu',
            'cpu',
            'cooler',
            'ram',
            'ssd',
            'case',
            'power supply',
            'keyboard',
            'mouse',
            'monitor',
        ],
        default: 'other',
        required: true
    }
    // Add compound index for faster grouping
}, {
    timestamps: true
});

// Create compound index for grouping operations
partSchema.index({ name: 1, location: 1 });

module.exports = mongoose.model('part', partSchema);