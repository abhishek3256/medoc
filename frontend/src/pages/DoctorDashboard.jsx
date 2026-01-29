import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [tokens, setTokens] = useState([]);
    const [slotInfo, setSlotInfo] = useState({ currentCount: 0, maxCapacity: 0 });

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            fetchTokens();
            fetchSlot();
            const interval = setInterval(() => {
                fetchTokens();
                fetchSlot();
            }, 5000); // Auto refresh every 5s
            return () => clearInterval(interval);
        }
    }, [selectedDoctor]);

    const fetchDoctors = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/doctors`);
            setDoctors(res.data);
            if (res.data.length > 0) setSelectedDoctor(res.data[0]._id);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTokens = async () => {
        if (!selectedDoctor) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/tokens/${selectedDoctor}`);
            setTokens(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSlot = async () => {
        if (!selectedDoctor) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/slots/${selectedDoctor}`);
            setSlotInfo(res.data);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, status) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${API_URL}/api/tokens/${id}/status`, { status });
            fetchTokens(); // Immediate refresh
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const waitingTokens = tokens.filter(t => t.status === 'waiting');

    return (
        <div>
            <h1>Doctor Dashboard</h1>

            <div style={{ marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '8px' }}>
                <label>Select Doctor View: </label>
                <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>

                <div style={{ marginTop: '10px', fontSize: '1.1em' }}>
                    <strong>Today's Slot Utilization: </strong>
                    <span style={{ color: slotInfo.currentCount >= slotInfo.maxCapacity ? 'red' : 'green' }}>
                        {slotInfo.currentCount} / {slotInfo.maxCapacity}
                    </span>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <h2>Next Patient</h2>
                    {waitingTokens.length > 0 ? (
                        <div className="card" style={{ textAlign: 'left', borderLeft: '5px solid #007bff' }}>
                            <h1 style={{ fontSize: '4rem', margin: '10px 0' }}>#{waitingTokens[0].tokenNumber}</h1>
                            <h3>{waitingTokens[0].patientName}</h3>
                            <p>Source: <span className={`status-${waitingTokens[0].source}`} style={{ padding: '2px 5px', borderRadius: '3px' }}>{waitingTokens[0].source.toUpperCase()}</span></p>

                            <div style={{ marginTop: '20px' }}>
                                <button className="success" onClick={() => updateStatus(waitingTokens[0]._id, 'completed')} style={{ marginRight: '10px', background: 'green' }}>
                                    Mark Completed
                                </button>
                                <button className="danger" onClick={() => updateStatus(waitingTokens[0]._id, 'noshow')} style={{ background: 'orange' }}>
                                    Mark No-Show
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card"><h3>No Waiting Patients</h3></div>
                    )}
                </div>

                <div>
                    <h2>Queue List</h2>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        {waitingTokens.map((t, index) => (
                            <div key={t._id} style={{ padding: '10px', borderBottom: '1px solid #eee', background: index === 0 ? '#f0f8ff' : 'white' }}>
                                <strong>#{t.tokenNumber}</strong> - {t.patientName}
                            </div>
                        ))}
                        {waitingTokens.length === 0 && <p style={{ padding: '10px' }}>Queue Empty</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
