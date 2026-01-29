const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: Number,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    source: {
        type: String,
        enum: ['online', 'walkin', 'priority', 'followup', 'emergency'],
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'completed', 'cancelled', 'noshow'],
        default: 'waiting'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Token', tokenSchema);
