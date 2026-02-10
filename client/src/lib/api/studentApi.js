/* ================= CONFIG ================= */

// Import centralized configuration
import { API_BASE_URL } from '../config.js';

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

export const getMyEnrollments = () => {
  return fetchAPI(
    "/api/student/enrollments"
  );
};

/* ================= COURSE PROGRESS APIs ================= */

export const getStudentCourseProgress = () => {
  return fetchAPI("/api/student/course-progress");
};

export const getCourseProgress = (courseId) => {
  return fetchAPI(`/api/student/course-progress/${courseId}`);
};

export const markLessonComplete = (courseId, lessonId, timeSpent = 0) => {
  return fetchAPI(`/api/student/course-progress/${courseId}/complete-lesson/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify({ timeSpent }),
  });
};

export const unmarkLessonComplete = (courseId, lessonId) => {
  return fetchAPI(`/api/student/course-progress/${courseId}/uncomplete-lesson/${lessonId}`, {
    method: "PATCH",
  });
};

export const updateCourseStatus = (courseId, status) => {
  return fetchAPI(`/api/student/course-progress/${courseId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const getCourseStats = () => {
  return fetchAPI("/api/student/course-stats");
};

/* ================= CALENDAR/EVENT APIs ================= */

export const createEvent = (eventData) => {
  return fetchAPI("/api/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

export const getEvents = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(
    `/api/events${query ? `?${query}` : ""}`
  );
};

export const getEventById = (id) => {
  return fetchAPI(`/api/events/${id}`);
};

export const getEventsByDate = (date) => {
  return fetchAPI(`/api/events/date/${date}`);
};

export const updateEvent = (id, eventData) => {
  return fetchAPI(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = (id) => {
  return fetchAPI(`/api/events/${id}`, {
    method: "DELETE",
  });
};

export const toggleEventCompletion = (id) => {
  return fetchAPI(`/api/events/${id}/toggle`, {
    method: "PATCH",
  });
};

export const getUpcomingEvents = (limit = 5) => {
  return fetchAPI(`/api/events/upcoming?limit=${limit}`);
};

export const getPendingTasks = (limit = 10) => {
  return fetchAPI(`/api/events/tasks/pending?limit=${limit}`);
};

export const deleteAllEvents = () => {
  return fetchAPI("/api/events", {
    method: "DELETE",
  });
};

/* ================= TEACHER APIs ================= */

export const getTeacherDashboardStats = () => {
  return fetchAPI(
    "/api/teacher/dashboard/stats"
  );
};

/* ================= SEARCH APIs ================= */

export const searchCourses = (query, limit = 10) => {
    const encodedQuery = encodeURIComponent(query);
    return fetchAPI(`/api/courses/search?q=${encodedQuery}&limit=${limit}`);
};

export const searchResources = (query, limit = 10) => {
    const encodedQuery = encodeURIComponent(query);
    return fetchAPI(`/api/resource/search?q=${encodedQuery}&limit=${limit}`);
};

/* ================= EXPORT ================= */

export default {
  getStudentAttendance,
  getStudentPerformance,
  getStudentOverview,
  getStudentActivityHours,
  getStudentDashboardStats,
  getMyEnrollments,
  getStudentCourseProgress,
  getCourseProgress,
  markLessonComplete,
  unmarkLessonComplete,
  updateCourseStatus,
  getCourseStats,
  getTeacherDashboardStats,
  searchCourses,
  searchResources,
};
