const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Check if 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Cannot connect to Spring Boot backend at ${API_BASE_URL}. Ensure backend is running on port 8080.`);
    }
    throw err;
  }
}

export const api = {
  // System Health
  checkHealth: async () => {
    try {
      await request('/dashboard/stats');
      return true;
    } catch {
      return false;
    }
  },

  // Dashboard Stats
  getDashboardStats: () => request('/dashboard/stats'),

  // Students CRUD
  getStudents: () => request('/students'),
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (studentData) => request('/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),
  updateStudent: (id, studentData) => request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData)
  }),
  deleteStudent: (id) => request(`/students/${id}`, {
    method: 'DELETE'
  }),

  // Company Drives CRUD
  getDrives: () => request('/drives'),
  getDriveById: (id) => request(`/drives/${id}`),
  createDrive: (driveData) => request('/drives', {
    method: 'POST',
    body: JSON.stringify(driveData)
  }),
  updateDrive: (id, driveData) => request(`/drives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(driveData)
  }),
  deleteDrive: (id) => request(`/drives/${id}`, {
    method: 'DELETE'
  }),

  // Applications Workflow
  getApplications: () => request('/applications'),
  applyToDrive: (applicationData) => request('/applications/apply', {
    method: 'POST',
    body: JSON.stringify(applicationData)
  }),
  updateApplicationStatus: (id, statusData) => request(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  }),
  deleteApplication: (id) => request(`/applications/${id}`, {
    method: 'DELETE'
  })
};
