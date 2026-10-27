import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import DrivesView from './components/DrivesView';
import ApplicationsView from './components/ApplicationsView';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  // Fetch all data
  const loadData = useCallback(async () => {
    setLoading(true);
    setGlobalError('');
    try {
      const [statsData, studentsData, drivesData, appsData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getStudents().catch(() => []),
        api.getDrives().catch(() => []),
        api.getApplications().catch(() => [])
      ]);

      if (statsData !== null) {
        setIsBackendOnline(true);
        setStats(statsData);
        setStudents(studentsData || []);
        setDrives(drivesData || []);
        setApplications(appsData || []);
      } else {
        setIsBackendOnline(false);
        setGlobalError('Backend is offline or database is not reachable. Please start the Spring Boot application on port 8080.');
      }
    } catch (err) {
      setIsBackendOnline(false);
      setGlobalError(err.message || 'Error communicating with placement backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Student Actions
  const handleAddStudent = async (studentData) => {
    await api.createStudent(studentData);
    await loadData();
  };

  const handleUpdateStudent = async (id, studentData) => {
    await api.updateStudent(id, studentData);
    await loadData();
  };

  const handleDeleteStudent = async (id) => {
    await api.deleteStudent(id);
    await loadData();
  };

  // Drive Actions
  const handleAddDrive = async (driveData) => {
    await api.createDrive(driveData);
    await loadData();
  };

  const handleUpdateDrive = async (id, driveData) => {
    await api.updateDrive(id, driveData);
    await loadData();
  };

  const handleDeleteDrive = async (id) => {
    await api.deleteDrive(id);
    await loadData();
  };

  // Application Actions
  const handleApply = async (applicationData) => {
    await api.applyToDrive(applicationData);
    await loadData();
  };

  const handleUpdateStatus = async (id, statusData) => {
    await api.updateApplicationStatus(id, statusData);
    await loadData();
  };

  const handleDeleteApplication = async (id) => {
    await api.deleteApplication(id);
    await loadData();
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendOnline={isBackendOnline}
        checkStatus={loadData}
      />

      <main className="main-content">
        {globalError && (
          <div className="alert alert-warning">
            <div>
              <strong>Connection Alert:</strong> {globalError}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              Retry Connection
            </button>
          </div>
        )}

        {loading && students.length === 0 && drives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h3>Connecting to Placement Management System...</h3>
            <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
              Communicating with Spring Boot REST service on http://localhost:8080
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                students={students}
                drives={drives}
                applications={applications}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'students' && (
              <StudentsView
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'drives' && (
              <DrivesView
                drives={drives}
                onAddDrive={handleAddDrive}
                onUpdateDrive={handleUpdateDrive}
                onDeleteDrive={handleDeleteDrive}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsView
                students={students}
                drives={drives}
                applications={applications}
                onApply={handleApply}
                onUpdateStatus={handleUpdateStatus}
                onDeleteApplication={handleDeleteApplication}
              />
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--slate-200)', background: '#fff', padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
        PlaceTrack &bull; Full-Stack College Project &bull; React.js + Spring Boot + MySQL
      </footer>
    </div>
  );
}
