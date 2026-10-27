import React, { useState } from 'react';
import Modal from './Modal';

export default function DrivesView({ drives, onAddDrive, onUpdateDrive, onDeleteDrive }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);

  const initialFormState = {
    companyName: '',
    jobRole: '',
    packageLpa: '',
    location: '',
    minCgpa: '7.0',
    eligibleDepartments: 'Computer Science, Information Technology',
    driveDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'OPEN',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingDrive(null);
    setFormData(initialFormState);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      companyName: drive.companyName || '',
      jobRole: drive.jobRole || '',
      packageLpa: drive.packageLpa !== undefined ? drive.packageLpa : '',
      location: drive.location || '',
      minCgpa: drive.minCgpa !== undefined ? drive.minCgpa : '7.0',
      eligibleDepartments: drive.eligibleDepartments || '',
      driveDate: drive.driveDate || '',
      status: drive.status || 'OPEN',
      description: drive.description || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.companyName.trim() || !formData.jobRole.trim()) {
      setFormError('Company name and Job role are required.');
      return;
    }

    const packageNum = parseFloat(formData.packageLpa);
    if (isNaN(packageNum) || packageNum < 0) {
      setFormError('Package (LPA) must be a positive number.');
      return;
    }

    const minCgpaNum = parseFloat(formData.minCgpa);
    if (isNaN(minCgpaNum) || minCgpaNum < 0 || minCgpaNum > 10) {
      setFormError('Minimum CGPA must be between 0.0 and 10.0.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        packageLpa: packageNum,
        minCgpa: minCgpaNum
      };

      if (editingDrive) {
        await onUpdateDrive(editingDrive.id, payload);
      } else {
        await onAddDrive(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="header-title">Placement Drives & Companies</h1>
          <p className="header-subtitle">Schedule, manage, and monitor company recruitment events</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Schedule New Drive
        </button>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap', maxWidth: '600px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search companies, roles, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open Only</option>
              <option value="CLOSED">Closed Only</option>
            </select>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Showing {filteredDrives.length} drives
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Role</th>
                  <th>Package (CTC)</th>
                  <th>Cutoff Criteria</th>
                  <th>Eligible Branches</th>
                  <th>Drive Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrives.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{d.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>📍 {d.location || 'Not Specified'}</div>
                    </td>
                    <td>{d.jobRole}</td>
                    <td>
                      <span className="badge badge-green">{d.packageLpa} LPA</span>
                    </td>
                    <td>
                      <span className="badge badge-yellow">&ge; {d.minCgpa} CGPA</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '200px' }}>
                      {d.eligibleDepartments || 'All Branches'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{d.driveDate || 'TBD'}</td>
                    <td>
                      <span className={`badge ${d.status === 'OPEN' ? 'badge-blue' : 'badge-gray'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(d)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Delete recruitment drive for ${d.companyName}?`)) {
                              onDeleteDrive(d.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDrives.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                      No recruitment drives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Drive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDrive ? `Edit Drive: ${editingDrive.companyName}` : 'Schedule Recruitment Drive'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {formError && <div className="alert alert-danger">{formError}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Google, Amazon, TCS"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Role *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Software Engineer"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Package (LPA in ₹) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  required
                  placeholder="e.g. 12.5"
                  value={formData.packageLpa}
                  onChange={(e) => setFormData({ ...formData, packageLpa: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum CGPA Cutoff *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  required
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bangalore / Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Drive Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.driveDate}
                  onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Drive Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="OPEN">OPEN (Accepting Applications)</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Eligible Departments</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science, IT, ECE"
                  value={formData.eligibleDepartments}
                  onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description & Details</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Key responsibilities, perks, technical requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingDrive ? 'Update Drive' : 'Schedule Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
