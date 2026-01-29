import React, { useState } from 'react';
import axios from 'axios';

function AddDoctorPage() {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        slotTime: '9-10',
        maxCapacity: 10
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const slotOptions = [
        '9-10', '10-11', '11-12', '12-1', '2-3', '3-4', '4-5'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            // Use env variable or default to localhost for dev
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/doctors`, formData);
            setMessage('Doctor added successfully!');
            setFormData({ name: '', specialty: '', slotTime: '9-10', maxCapacity: 10 }); // Reset form
        } catch (err) {
            setError('Failed to add doctor. ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="form-container">
            <h1>Add New Doctor</h1>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Doctor Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Dr. Name"
                    />
                </div>

                <div className="form-group">
                    <label>Specialty:</label>
                    <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        required
                        placeholder="Cardiologist, Dentist, etc."
                    />
                </div>

                <div className="form-group">
                    <label>Slot Time:</label>
                    <select name="slotTime" value={formData.slotTime} onChange={handleChange}>
                        {slotOptions.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Max Token Capacity:</label>
                    <input
                        type="number"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <button type="submit">Add Doctor</button>
            </form>
        </div>
    );
}

export default AddDoctorPage;
