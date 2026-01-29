import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookTokenPage() {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        phone: '',
        doctorId: '',
        source: 'online' // Default
    });
    const [selectedDoctorSlot, setSelectedDoctorSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [lastToken, setLastToken] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/doctors`);
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
            setError("Could not load doctors.");
        }
    };

    const handleDoctorChange = async (e) => {
        const docId = e.target.value;
        setFormData({ ...formData, doctorId: docId });
        if (docId) {
            fetchSlotInfo(docId);
        } else {
            setSelectedDoctorSlot(null);
        }
    };

    const fetchSlotInfo = async (docId) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/slots/${docId}`);
            setSelectedDoctorSlot(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmergencyClick = () => {
        // Override form for emergency
        setFormData({ ...formData, source: 'emergency' });
        setMessage("Emergency Mode Activated: Slot capacity will be ignored.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        setLastToken(null);

        // Basic Validation
        if (!formData.doctorId) {
            setError("Please select a doctor.");
            setLoading(false);
            return;
        }

        // Frontend Check (Optional, as backend does it too)
        if (formData.source !== 'emergency' && selectedDoctorSlot) {
            if (selectedDoctorSlot.currentCount >= selectedDoctorSlot.maxCapacity) {
                setError("Slot is full! Please choose emergency if applicable.");
                setLoading(false);
                return;
            }
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/tokens`, formData);
            setLastToken(res.data);
            setMessage(`Token Generated Successfully! Token No: ${res.data.tokenNumber}`);

            // Refresh slot info
            fetchSlotInfo(formData.doctorId);

            // Reset form partially
            setFormData({ ...formData, patientName: '', phone: '', source: 'online' });
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Book Appointment Token</h1>

            {message && <div className={formData.source === 'emergency' ? "error-msg" : "success-msg"}>{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            {lastToken && (
                <div className="card" style={{ backgroundColor: '#e3f2fd', marginBottom: '20px' }}>
                    <h2>Your Token Number</h2>
                    <h1 style={{ fontSize: '3rem', border: 'none' }}>{lastToken.tokenNumber}</h1>
                    <p>Doctor: {doctors.find(d => d._id === lastToken.doctorId)?.name}</p>
                    <p>Slot: {lastToken.slotTime}</p>
                </div>
            )}

            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <button type="button" className="danger" onClick={handleEmergencyClick}>
                    🚨 Add Emergency Token
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient Name:</label>
                    <input name="patientName" value={formData.patientName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Select Doctor:</label>
                    <select name="doctorId" value={formData.doctorId} onChange={handleDoctorChange} required>
                        <option value="">-- Choose Doctor --</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>
                                {doc.name} ({doc.specialty}) - {doc.slotTime}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedDoctorSlot && (
                    <div className="form-group" style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>Slot Status: </strong>
                        {selectedDoctorSlot.currentCount} / {selectedDoctorSlot.maxCapacity} Booked
                        {selectedDoctorSlot.currentCount >= selectedDoctorSlot.maxCapacity && (
                            <span style={{ color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>FULL</span>
                        )}
                    </div>
                )}

                <div className="form-group">
                    <label>Booking Source:</label>
                    <select name="source" value={formData.source} onChange={handleChange}>
                        <option value="online">Online</option>
                        <option value="walkin">Walk-in</option>
                        <option value="priority">Priority</option>
                        <option value="followup">Follow-up</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} style={formData.source === 'emergency' ? { backgroundColor: 'red' } : {}}>
                    {loading ? 'Booking...' : (formData.source === 'emergency' ? 'Book Emergency Token' : 'Generate Token')}
                </button>
            </form>
        </div>
    );
}

export default BookTokenPage;
