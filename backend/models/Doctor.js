const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    slotTime: {
        type: String, // e.g., "9-10"
        required: true
    },
    maxCapacity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
