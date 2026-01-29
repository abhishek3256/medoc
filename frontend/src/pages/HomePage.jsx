import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="home-container">
            <h1>Welcome to Medoc Hospital OPD</h1>
            <p>Select an option below to proceed:</p>

            <div className="card-grid">
                <Link to="/book-token" className="home-nav-btn">
                    Book Token
                </Link>
                <Link to="/view-tokens" className="home-nav-btn">
                    View Live Queue
                </Link>
                <Link to="/doctor-dashboard" className="home-nav-btn">
                    Doctor Dashboard
                </Link>
                <Link to="/add-doctor" className="home-nav-btn" style={{ backgroundColor: '#6c757d' }}>
                    Add New Doctor (Admin)
                </Link>
                <Link to="/simulation" className="home-nav-btn" style={{ backgroundColor: '#17a2b8' }}>
                    System Simulation
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
