/**
 * Exam API - Secure Online Examination System
 * Handles all exam-related API calls with anti-cheating features
 */

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

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
};

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
    console.error("Exam API Error:", error.message);
    throw error;
  }
};

/**
 * Start an exam session
 * POST /api/exams/:assignmentId/start
 */
export const startExam = async (assignmentId, duration = 60) => {
  return fetchAPI(`/api/exams/${assignmentId}/start`, {
    method: "POST",
    body: JSON.stringify({ duration }),
  });
};

/**
 * Submit exam with answers
 * POST /api/exams/:examId/submit
 */
export const submitExam = async (examId, answers, timeSpent) => {
  return fetchAPI(`/api/exams/${examId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers, timeSpent }),
  });
};

/**
 * Send heartbeat to keep exam active
 * POST /api/exams/:examId/heartbeat
 */
export const sendHeartbeat = async (examId, status, timeOutside, pageStatus) => {
  return fetchAPI(`/api/exams/${examId}/heartbeat`, {
    method: "POST",
    body: JSON.stringify({ status, timeOutside, pageStatus }),
  });
};

/**
 * Report a violation
 * POST /api/exams/:examId/violation
 */
export const reportViolation = async (examId, type, details, duration) => {
  return fetchAPI(`/api/exams/${examId}/violation`, {
    method: "POST",
    body: JSON.stringify({ type, details, duration }),
  });
};

/**
 * Get exam session status
 * GET /api/exams/:examId/status
 */
export const getExamStatus = async (examId) => {
  return fetchAPI(`/api/exams/${examId}/status`);
};

/**
 * Get student's active exams
 * GET /api/exams/student/active
 */
export const getActiveExams = async () => {
  return fetchAPI("/api/exams/student/active");
};

/**
 * Get student's exam history
 * GET /api/exams/student/history
 */
export const getExamHistory = async () => {
  return fetchAPI("/api/exams/student/history");
};

/**
 * Get exam analytics for teacher
 * GET /api/exams/analytics/:assignmentId
 */
export const getExamAnalytics = async (assignmentId) => {
  return fetchAPI(`/api/exams/analytics/${assignmentId}`);
};

/**
 * Reset exam session (for testing/admin)
 * POST /api/exams/:examId/reset
 */
export const resetExamSession = async (examId) => {
  return fetchAPI(`/api/exams/${examId}/reset`, {
    method: "POST",
  });
};

export default {
  startExam,
  submitExam,
  sendHeartbeat,
  reportViolation,
  getExamStatus,
  getActiveExams,
  getExamHistory,
  getExamAnalytics,
  resetExamSession,
};

