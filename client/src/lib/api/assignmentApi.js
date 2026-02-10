/* ================= CONFIG ================= */

const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
    return envUrl.replace(/\/+$/, '');
  }
  if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
    return 'https://mdai-self.vercel.app';
  }
  return 'http://localhost:5000';
};

const API_BASE_URL = getBackendURL();

/* ================= TOKEN HELPER ================= */

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
};

/* ================= GENERIC FETCH WRAPPER ================= */

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

/* ================= ASSIGNMENT APIs ================= */

// Get all assignments for teacher
export const getTeacherAssignments = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/api/assignments/teacher${query ? `?${query}` : ""}`);
};

// Get teacher's assignment statistics
export const getTeacherAssignmentStats = () => {
  return fetchAPI("/api/assignments/teacher/stats");
};

// Get single assignment
export const getAssignment = (id) => {
  return fetchAPI(`/api/assignments/${id}`);
};

// Create new assignment (teacher)
export const createAssignment = async (formData) => {
  const url = `${API_BASE_URL}/api/assignments`;
  const token = getAuthToken();
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create assignment");
  }
  return data;
};

// Update assignment (teacher)
export const updateAssignment = async (id, formData) => {
  const url = `${API_BASE_URL}/api/assignments/${id}`;
  const token = getAuthToken();
  
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: token,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update assignment");
  }
  return data;
};

// Delete assignment (teacher)
export const deleteAssignment = (id) => {
  return fetchAPI(`/api/assignments/${id}`, {
    method: "DELETE",
  });
};

// Toggle publish status (teacher)
export const togglePublishAssignment = (id) => {
  return fetchAPI(`/api/assignments/${id}/toggle-publish`, {
    method: "PATCH",
  });
};

/* ================= STUDENT ASSIGNMENT APIs ================= */

// Get all assignments for student
export const getStudentAssignments = () => {
  return fetchAPI("/api/assignments/student");
};

// Get assignments for a specific course
export const getCourseAssignments = (courseId) => {
  return fetchAPI(`/api/assignments/course/${courseId}`);
};

/* ================= SUBMISSION APIs ================= */

// Submit assignment (student)
export const submitAssignment = async (assignmentId, formData) => {
  const url = `${API_BASE_URL}/api/submissions/${assignmentId}`;
  const token = getAuthToken();
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to submit assignment");
  }
  return data;
};

// Get my submissions (student)
export const getMySubmissions = () => {
  return fetchAPI("/api/submissions/my");
};

// Delete submission (student - before deadline)
export const deleteSubmission = (submissionId) => {
  return fetchAPI(`/api/submissions/${submissionId}`, {
    method: "DELETE",
  });
};

/* ================= TEACHER SUBMISSION APIs ================= */

// Get all submissions for an assignment (teacher)
export const getAssignmentSubmissions = (assignmentId) => {
  return fetchAPI(`/api/submissions/assignment/${assignmentId}`);
};

// Get submission details (teacher or student)
export const getSubmission = (submissionId) => {
  return fetchAPI(`/api/submissions/${submissionId}`);
};

// Grade submission (teacher)
export const gradeSubmission = async (submissionId, { marks, feedback, latePenalty }) => {
  return fetchAPI(`/api/submissions/${submissionId}/grade`, {
    method: "PUT",
    body: JSON.stringify({ marks, feedback, latePenalty }),
  });
};

// Get course submission stats (teacher)
export const getCourseSubmissionStats = (courseId) => {
  return fetchAPI(`/api/submissions/course/${courseId}/stats`);
};

/* ================= EXPORT ================= */

export default {
  // Teacher Assignment APIs
  getTeacherAssignments,
  getTeacherAssignmentStats,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  togglePublishAssignment,
  
  // Student Assignment APIs
  getStudentAssignments,
  getCourseAssignments,
  
  // Submission APIs
  submitAssignment,
  getMySubmissions,
  deleteSubmission,
  
  // Teacher Submission APIs
  getAssignmentSubmissions,
  getSubmission,
  gradeSubmission,
  getCourseSubmissionStats,
};

