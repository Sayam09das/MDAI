/* ================= CONFIG ================= */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

/* ================= STUDENT APIs ================= */

export const getStudentAttendance = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(
    `/api/student/attendance${query ? `?${query}` : ""}`
  );
};

export const getStudentPerformance = (range = "monthly") => {
  return fetchAPI(
    `/api/student/performance?range=${range}`
  );
};

export const getStudentOverview = () => {
  return fetchAPI(
    "/api/student/overview"
  );
};

export const getStudentActivityHours = (date) => {
  return fetchAPI(
    `/api/student/activity-hours${date ? `?date=${date}` : ""}`
  );
};

export const getStudentDashboardStats = () => {
  return fetchAPI(
    "/api/student/dashboard/stats"
  );
};

/* ================= TEACHER APIs ================= */

export const getTeacherDashboardStats = () => {
  return fetchAPI(
    "/api/teacher/dashboard/stats"
  );
};

/* ================= EXPORT ================= */

export default {
  getStudentAttendance,
  getStudentPerformance,
  getStudentOverview,
  getStudentActivityHours,
  getStudentDashboardStats,
  getTeacherDashboardStats,
};
