// Helper to get the API base URL
const getBaseUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Default for production
  return '/api/v1';
};

const API_BASE_URL = getBaseUrl();

// Helper to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
};

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/* ================= STUDENT API ================= */

// Get student's attendance records
export const getStudentAttendance = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/student/attendance${queryString ? `?${queryString}` : ""}`);
};

// Get student's performance data
export const getStudentPerformance = async (range = "monthly") => {
  return fetchAPI(`/student/performance?range=${range}`);
};

// Get student's overview (enrolled courses, stats)
export const getStudentOverview = async () => {
  return fetchAPI("/student/overview");
};

// Get student's activity hours
export const getStudentActivityHours = async (date) => {
  const queryString = date ? `?date=${date}` : "";
  return fetchAPI(`/student/activity-hours${queryString}`);
};

// Get student's dashboard stats
export const getStudentDashboardStats = async () => {
  return fetchAPI("/student/dashboard/stats");
};

export default {
  getStudentAttendance,
  getStudentPerformance,
  getStudentOverview,
  getStudentActivityHours,
  getStudentDashboardStats,
};

