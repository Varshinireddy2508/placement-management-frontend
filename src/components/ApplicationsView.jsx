import React, { useState } from 'react';

export default function ApplicationsView({ students, drives, applications, onApply, onUpdateStatus, onDeleteApplication }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState('ALL');

  const selectedStudent = students.find((s) => s.id === Number(selectedStudentId));
  const selectedDrive = drives.find((d) => d.id === Number(selectedDriveId));

  // Live eligibility evaluation
  const isEligible = selectedStudent && selectedDrive 
    ? selectedStudent.cgpa >= selectedDrive.minCgpa 
    : null;

  const handleApply = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedStudentId || !selectedDriveId) {
      setErrorMsg('Please select both a student and a placement drive.');
      return;
    }

    if (isEligible === false) {
      setErrorMsg(`Ineligible: Student CGPA (${selectedStudent?.cgpa}) is lower than the cutoff requirement (${selectedDrive?.minCgpa}).`);
      return;
    }

    try {
      setSubmitting(true);
      await onApply({
        studentId: Number(selectedStudentId),
        companyDriveId: Number(selectedDriveId),
        remarks: remarks.trim()
      });
      setSuccessMsg(`Application successfully recorded for ${selectedStudent?.name} at ${selectedDrive?.companyName}!`);
      setRemarks('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await onUpdateStatus(appId, { status: newStatus });
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const openDrives = drives.filter((d) => d.status === 'OPEN');

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="header-title">Job Application Pipeline</h1>
          <p className="header-subtitle">Process student candidacies, evaluate cutoffs, and manage interview rounds</p>
        </div>
      </div>

      {/* One-Click Apply Panel */}
      <div className="content-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div className="card-header">
          <h2 className="card-title">📝 New Application Submission</h2>
        </div>
        <div className="card-body">
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form onSubmit={handleApply}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">1. Select Candidate (Student) *</label>
                <select
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  required
                >
                  <option value="">-- Choose Candidate --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) &mdash; {s.department} | CGPA: {s.cgpa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">2. Select Placement Drive *</label>
                <select
                  className="form-select"
                  value={selectedDriveId}
                  onChange={(e) => {
                    setSelectedDriveId(e.target.value);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  required
                >
                  <option value="">-- Choose Company Drive --</option>
                  {openDrives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.companyName} &mdash; {d.jobRole} ({d.packageLpa} LPA) | Min: {d.minCgpa} CGPA
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Cutoff Evaluation Banner */}
            {selectedStudent && selectedDrive && (
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                backgroundColor: isEligible ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${isEligible ? '#a7f3d0' : '#fecaca'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div>
                  <strong>Eligibility Check:</strong> Candidate CGPA: <strong>{selectedStudent.cgpa}</strong> | Drive Cutoff: <strong>{selectedDrive.minCgpa}</strong>
                </div>
                <div>
                  {isEligible ? (
                    <span className="badge badge-green">✓ Eligible to Apply</span>
                  ) : (
                    <span className="badge badge-red">✗ Ineligible (Below Cutoff)</span>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Candidate Remarks / Note</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Certified AWS Cloud Practitioner; prefers backend role"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || (isEligible === false)}
            >
              {submitting ? 'Verifying & Submitting...' : 'Submit Application &rarr;'}
            </button>
          </form>
        </div>
      </div>

      {/* Applications List & Status Workflow */}
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">All Submissions &amp; Hiring Pipeline</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Filter:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Round</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company &amp; Role</th>
                  <th>Drive Cutoff</th>
                  <th>Applied On</th>
                  <th>Status Workflow</th>
                  <th>Remarks</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.student?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {app.student?.rollNumber} &bull; {app.student?.department} (CGPA: {app.student?.cgpa})
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.companyDrive?.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {app.companyDrive?.jobRole} &bull; <strong style={{ color: 'var(--success)' }}>{app.companyDrive?.packageLpa} LPA</strong>
                      </div>
                    </td>
                    <td>&ge; {app.companyDrive?.minCgpa} CGPA</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      {/* Interactive Status Transition Dropdown */}
                      <select
                        className="form-select"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.3rem 0.5rem',
                          fontWeight: 700,
                          backgroundColor:
                            app.status === 'SELECTED' ? '#ecfdf5' :
                            app.status === 'SHORTLISTED' ? '#eff6ff' :
                            app.status === 'REJECTED' ? '#fef2f2' : '#fffbeb'
                        }}
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="INTERVIEW">INTERVIEW ROUND</option>
                        <option value="SELECTED">SELECTED / OFFERED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '200px' }}>{app.remarks || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to withdraw/delete this application?')) {
                            onDeleteApplication(app.id);
                          }
                        }}
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                      No applications recorded yet. Use the form above to submit an application.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
