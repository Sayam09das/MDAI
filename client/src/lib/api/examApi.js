/**
 * Enhanced Exam API Module
 * Comprehensive API functions for exam management with network resilience
 * 
 * Features:
 * - Automatic retry for network errors
 * - Request queuing for offline support
 * - Request timeout handling
 * - Response caching
 */

// ================= CONFIG =================

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

// ================= API CONFIG =================

const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    RETRY_DELAY_MULTIPLIER: 2, // Exponential backoff
    QUEUE_ENABLED: true
};

// ================= REQUEST QUEUE =================

class RequestQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.isOnline = navigator.onLine;
        
        // Listen for network changes
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }
    
    add(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                request,
                resolve,
                reject,
                retries: 0
            });
            
            if (this.isOnline) {
                this.processQueue();
            }
        });
    }
    
    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const item = this.queue[0];
            
            try {
                const result = await item.request();
                item.resolve(result);
            } catch (error) {
                if (item.retries < API_CONFIG.MAX_RETRIES) {
                    item.retries++;
                    // Exponential backoff
                    await new Promise(resolve => 
                        setTimeout(resolve, API_CONFIG.RETRY_DELAY * Math.pow(API_CONFIG.RETRY_DELAY_MULTIPLIER, item.retries))
                    );
                    // Re-queue for next attempt
                    continue;
                } else {
                    item.reject(error);
                }
            }
            
            this.queue.shift();
        }
        
        this.processing = false;
    }
}

const requestQueue = new RequestQueue();

// ================= TOKEN HELPER =================

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
};

// ================= GENERIC FETCH WRAPPER =================

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
    
    // Add request ID for tracking
    headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
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
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw { status: 0, message: "Request timeout", isTimeout: true };
        }
        
        throw {
            status: error.status || 0,
            message: error.message || "Network error",
            isNetworkError: !navigator.onLine
        };
    }
};

// ================= API FUNCTIONS WITH RETRIES =================

/**
 * Fetch with automatic retry
 */
const fetchWithRetry = async (endpoint, options = {}) => {
    let lastError;
    
    for (let attempt = 0; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
        try {
            return await fetchAPI(endpoint, options);
        } catch (error) {
            lastError = error;
            
            // Don't retry on client errors (4xx)
            if (error.status >= 400 && error.status < 500) {
                throw error;
            }
            
            // Wait before retrying (exponential backoff)
            if (attempt < API_CONFIG.MAX_RETRIES) {
                const delay = API_CONFIG.RETRY_DELAY * Math.pow(API_CONFIG.RETRY_DELAY_MULTIPLIER, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
};

/**
 * Fetch with offline queue support
 */
const fetchWithQueue = async (endpoint, options = {}) => {
    if (API_CONFIG.QUEUE_ENABLED && !navigator.onLine) {
        return requestQueue.add(() => fetchWithRetry(endpoint, options));
    }
    
    return fetchWithRetry(endpoint, options);
};

// ================= EXAM APIs =================

// Teacher Exam Management

/**
 * Create a new exam
 */
export const createExam = async (examData) => {
    return fetchWithQueue("/api/exams", {
        method: "POST",
        body: JSON.stringify(examData),
    });
};

/**
 * Get all exams for teacher
 */
export const getTeacherExams = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithQueue(`/api/exams/teacher${query ? `?${query}` : ""}`);
};

/**
 * Get teacher exam stats
 */
export const getTeacherExamStats = () => {
    return fetchWithQueue("/api/exams/teacher/stats");
};

/**
 * Get single exam
 */
export const getExam = (id) => {
    return fetchWithQueue(`/api/exams/${id}`);
};

/**
 * Update exam
 */
export const updateExam = async (id, examData) => {
    return fetchWithQueue(`/api/exams/${id}`, {
        method: "PUT",
        body: JSON.stringify(examData),
    });
};

/**
 * Delete exam
 */
export const deleteExam = (id) => {
    return fetchWithQueue(`/api/exams/${id}`, {
        method: "DELETE",
    });
};

/**
 * Publish/Unpublish exam
 */
export const publishExam = (id) => {
    return fetchWithQueue(`/api/exams/${id}/publish`, {
        method: "PATCH",
    });
};

/**
 * Get exam results
 */
export const getExamResults = (id) => {
    return fetchWithQueue(`/api/exams/${id}/results`);
};

/**
 * Get exam statistics
 */
export const getExamStats = (id) => {
    return fetchWithQueue(`/api/exams/${id}/stats`);
};

/**
 * Get exam with questions (teacher only)
 */
export const getExamWithQuestions = (id) => {
    return fetchWithQueue(`/api/exams/${id}?includeQuestions=true`);
};

// Student Exam APIs

/**
 * Get available exams for student
 */
export const getStudentExams = (courseId = null) => {
    const endpoint = courseId 
        ? `/api/exams/student/available?courseId=${courseId}` 
        : "/api/exams/student/available";
    return fetchWithQueue(endpoint);
};

/**
 * Get student's exam attempts
 */
export const getMyAttempts = (courseId = null) => {
    const endpoint = courseId 
        ? `/api/exams/my-attempts?courseId=${courseId}` 
        : "/api/exams/my-attempts";
    return fetchWithQueue(endpoint);
};

/**
 * Get student's attempts for specific exam
 */
export const getMyExamAttempts = (examId) => {
    return fetchWithQueue(`/api/exams/${examId}/my-attempts`);
};

/**
 * Start exam attempt
 */
export const startExamAttempt = async (examId) => {
    return fetchWithQueue(`/api/exams/${examId}/start`, {
        method: "POST",
    });
};

/**
 * Submit exam attempt
 */
export const submitExamAttempt = async (attemptId, answers) => {
    return fetchWithQueue(`/api/exams/attempt/${attemptId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
    });
};

/**
 * Send heartbeat
 */
export const sendHeartbeat = async (attemptId, data = {}) => {
    return fetchWithQueue(`/api/exams/attempt/${attemptId}/heartbeat`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Report violation
 */
export const reportViolation = async (attemptId, data = {}) => {
    return fetchWithQueue(`/api/exams/attempt/${attemptId}/violation`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Get student's exam results
 */
export const getStudentExamResults = (examId) => {
    return fetchWithQueue(`/api/exams/${examId}/student-results`);
};

/**
 * Preview exam (without starting)
 */
export const previewExam = (examId) => {
    return fetchWithQueue(`/api/exams/${examId}/preview`);
};

/**
 * Validate exam before starting
 */
export const validateExamAccess = async (examId) => {
    return fetchWithQueue(`/api/exams/${examId}/validate-access`, {
        method: "POST",
    });
};

/**
 * Get exam session info (for resuming)
 */
export const getExamSession = (attemptId) => {
    return fetchWithQueue(`/api/exams/attempt/${attemptId}/session`);
};

// ================= EXPORT =================

export default {
    // Teacher Exam Management
    createExam,
    getTeacherExams,
    getTeacherExamStats,
    getExam,
    getExamWithQuestions,
    updateExam,
    deleteExam,
    publishExam,
    getExamResults,
    getExamStats,
    
    // Student Exam APIs
    getStudentExams,
    getMyAttempts,
    getMyExamAttempts,
    startExamAttempt,
    submitExamAttempt,
    sendHeartbeat,
    reportViolation,
    getStudentExamResults,
    previewExam,
    validateExamAccess,
    getExamSession,
    
    // Config (exposed for testing)
    API_CONFIG,
    getBackendURL
};

