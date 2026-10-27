import React from 'react';

export default function Navbar({ activeTab, setActiveTab, isBackendOnline, checkStatus }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <span className="brand-title">PlaceTrack</span>
            <span className="brand-badge">College MVP</span>
          </div>
        </div>

        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            🎓 Students
          </button>
          <button
            className={`nav-btn ${activeTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveTab('drives')}
          >
            🏢 Placement Drives
          </button>
          <button
            className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📝 Applications
          </button>
        </div>

        <div className="status-indicator" title="Click to refresh connection status" onClick={checkStatus} style={{ cursor: 'pointer' }}>
          <span className={`status-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
          <span>{isBackendOnline ? 'API Connected' : 'API Offline'}</span>
        </div>
      </div>
    </nav>
  );
}
