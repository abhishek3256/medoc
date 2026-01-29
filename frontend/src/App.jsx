import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddDoctorPage from './pages/AddDoctorPage';
import BookTokenPage from './pages/BookTokenPage';
import ViewTokensPage from './pages/ViewTokensPage';
import DoctorDashboard from './pages/DoctorDashboard';
import SimulationPage from './pages/SimulationPage';
import './index.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <div className="nav-brand">Medoc Hospital</div>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/add-doctor">Add Doctor</Link></li>
                        <li><Link to="/book-token">Book Token</Link></li>
                        <li><Link to="/view-tokens">View Tokens</Link></li>
                        <li><Link to="/doctor-dashboard">Doctor Dashboard</Link></li>
                        <li><Link to="/simulation">Simulation</Link></li>
                    </ul>
                </nav>

                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/add-doctor" element={<AddDoctorPage />} />
                        <Route path="/book-token" element={<BookTokenPage />} />
                        <Route path="/view-tokens" element={<ViewTokensPage />} />
                        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                        <Route path="/simulation" element={<SimulationPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
