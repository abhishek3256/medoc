import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function SimulationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ generated: 0, cancelled: 0 });

    // Simulation Refs
    const intervalRef = useRef(null);

    // Hardcoded Doctor IDs (In real scenario, fetch these first. 
    // For now, let's just fetch them once on load to get real IDs)
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        axios.get(`${API_URL}/api/doctors`)
            .then(res => setDoctors(res.data))
            .catch(err => console.error(err));
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [msg, ...prev].slice(0, 20)); // Keep last 20
    };

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const sources = ['online', 'walkin', 'priority', 'followup', 'emergency'];

    const startSimulation = () => {
        if (doctors.length === 0) {
            alert("No doctors found! Please add doctors first.");
            return;
        }
        setIsRunning(true);
        intervalRef.current = setInterval(async () => {
            await runSimulationStep();
        }, 2000); // 2 second delay
    };

    const stopSimulation = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const resetSimulation = () => {
        stopSimulation();
        setLogs([]);
        setStats({ generated: 0, cancelled: 0 });
    };

    const runSimulationStep = async () => {
        const action = Math.random();
        const doctor = getRandomItem(doctors);

        // 80% Chance: Book Token
        // 20% Chance: Cancel Random Token (Not implemented fully for random cancellation of distinct IDs, 
        // but we can try cancelling the LAST generated one or just simulated log)

        if (action < 0.8) {
            // Book Token
            const fakePatient = `Patient-${Math.floor(Math.random() * 1000)}`;
            const source = getRandomItem(sources);

            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.post(`${API_URL}/api/tokens`, {
                    patientName: fakePatient,
                    phone: '555-0100',
                    source: source,
                    doctorId: doctor._id
                });

                setStats(prev => ({ ...prev, generated: prev.generated + 1 }));
                addLog(`✅ Booked: #${res.data.tokenNumber} for ${doctor.name} (${source})`);
            } catch (err) {
                addLog(`❌ Booking Failed: ${err.response?.data?.message || err.message}`);
            }

        } else {
            // Attempt Cancel (Simulated for visuals mainly unless we track IDs locally)
            // To really cancel, we'd need to fetch tokens and pick one.
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const tokensRes = await axios.get(`${API_URL}/api/tokens/${doctor._id}`);
                const waitingTokens = tokensRes.data.filter(t => t.status === 'waiting');

                if (waitingTokens.length > 0) {
                    const toCancel = getRandomItem(waitingTokens);
                    await axios.put(`${API_URL}/api/tokens/${toCancel._id}/cancel`);
                    setStats(prev => ({ ...prev, cancelled: prev.cancelled + 1 }));
                    addLog(`⚠️ Cancelled: #${toCancel.tokenNumber} (${toCancel.patientName})`);
                } else {
                    addLog(`ℹ️ No waiting tokens to cancel for ${doctor.name}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h1>System Simulation</h1>
            <p>Automatically generates bookings and cancellations to test the system.</p>

            <div style={{ marginBottom: '20px' }}>
                {!isRunning ? (
                    <button onClick={startSimulation} style={{ marginRight: '10px', background: 'green' }}>Start Simulation</button>
                ) : (
                    <button onClick={stopSimulation} style={{ marginRight: '10px', background: 'orange' }}>Pause Simulation</button>
                )}
                <button onClick={resetSimulation} className="danger">Reset</button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2>Stats</h2>
                    <p>Tokens Generated: <strong>{stats.generated}</strong></p>
                    <p>Tokens Cancelled: <strong>{stats.cancelled}</strong></p>
                    <p>Active Doctors: <strong>{doctors.length}</strong></p>
                </div>

                <div style={{ flex: 2, background: '#333', color: '#0f0', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', minHeight: '300px' }}>
                    <h2>Live Logs</h2>
                    {logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SimulationPage;
