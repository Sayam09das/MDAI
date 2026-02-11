/**
 * Course API Module
 * API functions for course management
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

// ================= Token Helper =================

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
};

// ================= Generic Fetch =================

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
            throw {
                status: response.status,
                message: data.message || "API request failed",
                data
            };
        }
        
        return data;
    } catch (error) {
        throw {
            status: error.status || 0,
            message: error.message || "Network error",
        };
    }
};

// ================= Course APIs =================

/**
 * Get teacher's courses
 */
export const getTeacherCourses = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/courses/teacher${query ? `?${query}` : ""}`);
};

/**
 * Get all courses
 */
export const getAllCourses = async () => {
    return fetchAPI("/api/courses");
};

/**
 * Get course by ID
 */
export const getCourse = async (id) => {
    return fetchAPI(`/api/courses/${id}`);
};

/**
 * Get enrolled students for a course
 */
export const getEnrolledStudents = async (courseId) => {
    return fetchAPI(`/api/courses/${courseId}/enrollments`);
};

/**
 * Create course
 */
export const createCourse = async (courseData) => {
    return fetchAPI("/api/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
    });
};

/**
 * Update course
 */
export const updateCourse = async (id, courseData) => {
    return fetchAPI(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
    });
};

/**
 * Delete course
 */
export const deleteCourse = async (id) => {
    return fetchAPI(`/api/courses/${id}`, {
        method: "DELETE",
    });
};

/**
 * Get student's enrolled courses
 */
export const getStudentCourses = async () => {
    return fetchAPI("/api/courses/student/enrolled");
};

/**
 * Enroll in a course
 */
export const enrollCourse = async (courseId) => {
    return fetchAPI(`/api/courses/${courseId}/enroll`, {
        method: "POST",
    });
};

/**
 * Get course progress
 */
export const getCourseProgress = async (courseId) => {
    return fetchAPI(`/api/courses/${courseId}/progress`);
};

// Export default with all functions
export default {
    getTeacherCourses,
    getAllCourses,
    getCourse,
    getEnrolledStudents,
    createCourse,
    updateCourse,
    deleteCourse,
    getStudentCourses,
    enrollCourse,
    getCourseProgress,
};

