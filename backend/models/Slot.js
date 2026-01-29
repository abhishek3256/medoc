const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    currentCount: {
        type: Number,
        default: 0
    },
    maxCapacity: {
        type: Number,
        required: true
    },
    date: {
        type: String, // Storing as string for simplicity (YYYY-MM-DD)
        required: true
    }
});

module.exports = mongoose.model('Slot', slotSchema);
