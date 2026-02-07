/**
 * Centralized configuration for API endpoints and backend URL
 * This file provides a single source of truth for backend URL configuration
 */

/**
 * Get the backend URL from environment variable with proper fallback
 * @returns {string} The backend URL to use for API calls
 */
export const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Return the environment URL if it exists and is valid
  if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
    // Remove trailing slashes to ensure consistent URL construction
    return envUrl.replace(/\/+$/, '');
  }
  
  // Fallback URLs based on the deployment environment
  if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
    return 'https://mdai-self.vercel.app';
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

/**
 * The backend URL constant to use in API calls
 * Use this instead of directly accessing import.meta.env.VITE_BACKEND_URL
 */
export const API_BASE_URL = getBackendURL();

/**
 * API endpoint constants for consistent reference
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
  },
  STUDENT: {
    DASHBOARD: '/api/student/dashboard/stats',
    ATTENDANCE: '/api/student/attendance',
    PERFORMANCE: '/api/student/performance',
    OVERVIEW: '/api/student/overview',
    COURSE_PROGRESS: '/api/student/course-progress',
    COURSE_STATS: '/api/student/course-stats',
  },
  TEACHER: {
    DASHBOARD: '/api/teacher/dashboard/stats',
  },
  COURSES: '/api/courses',
  EVENTS: '/api/events',
  MESSAGES: '/api/messages',
  RESOURCES: '/api/resource',
  ADMIN: '/api/admin',
};

export default {
  getBackendURL,
  API_BASE_URL,
  API_ENDPOINTS,
};

