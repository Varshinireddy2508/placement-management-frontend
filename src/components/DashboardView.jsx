import React from 'react';

export default function DashboardView({ stats, students, drives, applications, onNavigate }) {
  const placementRate = stats?.totalStudents > 0 
    ? Math.round((stats.selectedCount / stats.totalStudents) * 100) 
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="header-title">Placement Cell Overview</h1>
          <p className="header-subtitle">Real-time statistics and recruitment activity</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('students')}>
            Manage Students
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('drives')}>
            + Post Drive
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box blue">🎓</div>
          <div>
            <div className="metric-value">{stats?.totalStudents || students.length || 0}</div>
            <div className="metric-label">Registered Students</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box amber">🏢</div>
          <div>
            <div className="metric-value">{stats?.activeDrives || 0}</div>
            <div className="metric-label">Active Drives ({stats?.totalDrives || 0} Total)</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box purple">📝</div>
          <div>
            <div className="metric-value">{stats?.totalApplications || applications.length || 0}</div>
            <div className="metric-label">Total Applications</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">🏆</div>
          <div>
            <div className="metric-value">{stats?.selectedCount || 0}</div>
            <div className="metric-label">Students Placed ({placementRate}%)</div>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Active Placement Drives */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Featured Upcoming Drives</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('drives')}>
              View All &rarr;
            </button>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Cutoff CGPA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.slice(0, 4).map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 700 }}>{d.companyName}</td>
                      <td>{d.jobRole}</td>
                      <td><span className="badge badge-green">{d.packageLpa} LPA</span></td>
                      <td>{d.minCgpa} CGPA</td>
                      <td>
                        <span className={`badge ${d.status === 'OPEN' ? 'badge-blue' : 'badge-gray'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {drives.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                        No drives scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Applications Pipeline */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Application Pipeline</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('applications')}>
              Review &rarr;
            </button>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.student?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.student?.rollNumber}</div>
                      </td>
                      <td>
                        <div>{app.companyDrive?.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.companyDrive?.jobRole}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          app.status === 'SELECTED' ? 'badge-green' :
                          app.status === 'SHORTLISTED' ? 'badge-blue' :
                          app.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                        No applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
