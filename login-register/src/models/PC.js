const mongoose = require('mongoose');

const pcSchema = new mongoose.Schema({
    PCID: { type: String, unique: true, index: true },
    serialNumber: { type: String, unique: true },
    GPU: { type: String, required: true, index: true },
    CPU: { type: String, required: true, index: true },
    RAM: { type: String, required: true, index: true },
    Case: { type: String, required: true, index: true },
    Storage: { type: String, required: true, index: true },
    Location: { type: String, required: true, index: true },
    projectTag: { type: String, index: true },
    isAvailable: { type: Boolean, required: true, default: true },
    lastCheckedOut: { type: Date },
    checkoutHistory: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: Date,
        projectTag: String
    }]
}, { timestamps: true });

pcSchema.virtual('specs').get(function () {
    return `GPU: ${this.GPU}\nCPU: ${this.CPU}\nRAM: ${this.RAM}\nStorage: ${this.Storage}`;
});

module.exports = mongoose.model('PC', pcSchema);