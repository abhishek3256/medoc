const Doctor = require('../models/Doctor');
const Slot = require('../models/Slot');

exports.addDoctor = async (req, res) => {
    try {
        const { name, specialty, slotTime, maxCapacity } = req.body;
        const doctor = new Doctor({ name, specialty, slotTime, maxCapacity });
        await doctor.save();

        // Initialize a slot for today for this doctor (simplified for MVP)
        // In a real app, this would be a separate process or cron job
        const today = new Date().toISOString().split('T')[0];
        const slot = new Slot({
            doctorId: doctor._id,
            slotTime,
            maxCapacity,
            date: today
        });
        await slot.save();

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
