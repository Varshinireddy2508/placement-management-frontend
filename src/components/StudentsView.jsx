import React, { useState } from 'react';
import Modal from './Modal';

export default function StudentsView({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const initialFormState = {
    rollNumber: '',
    name: '',
    email: '',
    department: 'Computer Science',
    cgpa: '',
    graduationYear: new Date().getFullYear(),
    phone: '',
    skills: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData(initialFormState);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      rollNumber: student.rollNumber || '',
      name: student.name || '',
      email: student.email || '',
      department: student.department || 'Computer Science',
      cgpa: student.cgpa !== undefined ? student.cgpa : '',
      graduationYear: student.graduationYear || 2026,
      phone: student.phone || '',
      skills: student.skills || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation
    if (!formData.rollNumber.trim() || !formData.name.trim() || !formData.email.trim()) {
      setFormError('Roll number, Full Name, and Email are mandatory.');
      return;
    }
    const cgpaNum = parseFloat(formData.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setFormError('CGPA must be a valid number between 0.0 and 10.0.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        cgpa: cgpaNum,
        graduationYear: parseInt(formData.graduationYear, 10)
      };

      if (editingStudent) {
        await onUpdateStudent(editingStudent.id, payload);
      } else {
        await onAddStudent(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="header-title">Student Records</h1>
          <p className="header-subtitle">Manage registered candidates and eligibility criteria</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Register New Student
        </button>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap', maxWidth: '600px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, roll no, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              className="form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Batch</th>
                  <th>Skills</th>
                  <th>Contact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.rollNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{s.email}</div>
                    </td>
                    <td>{s.department}</td>
                    <td>
                      <span className={`badge ${s.cgpa >= 8.5 ? 'badge-green' : s.cgpa >= 7.5 ? 'badge-blue' : 'badge-yellow'}`}>
                        {s.cgpa.toFixed(2)} CGPA
                      </span>
                    </td>
                    <td>{s.graduationYear}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.skills || '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{s.phone || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(s)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Delete student record for ${s.name} (${s.rollNumber})?`)) {
                              onDeleteStudent(s.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                      No students found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.rollNumber}` : 'Register New Student'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {formError && <div className="alert alert-danger">{formError}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. 2022CS101"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">College Email *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. rahul@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm.">Electronics & Comm.</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Current CGPA (0.0 - 10.0) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  required
                  placeholder="e.g. 8.75"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year *</label>
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  className="form-input"
                  required
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Java, React, Spring Boot, MySQL"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
