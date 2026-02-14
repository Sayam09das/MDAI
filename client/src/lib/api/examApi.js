/**
 * Manual Exam API Module
 * API functions for manual evaluation exam system
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
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};

// ================= TOKEN HELPER =================

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
};

// ================= GENERIC FETCH =================

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
            message: error.message || "Network error"
        };
    }
};

// ================= API FUNCTIONS =================

// Teacher Exam Management

/**
 * Create a new manual exam
 */
export const createExam = async (examData) => {
    return fetchAPI("/api/exams", {
        method: "POST",
        body: JSON.stringify(examData),
    });
};

/**
 * Upload question paper for exam
 */
export const uploadQuestionPaper = async (examId, file) => {
    const url = `${API_BASE_URL}/api/exams/${examId}/question-paper`;
    
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || "File upload failed"
        };
    }

    return data;
};

/**
 * Get all exams for teacher
 */
export const getTeacherExams = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/exams/teacher${query ? `?${query}` : ""}`);
};

/**
 * Get single exam
 */
export const getExam = (id) => {
    return fetchAPI(`/api/exams/${id}`);
};

/**
 * Update exam
 */
export const updateExam = async (id, examData) => {
    return fetchAPI(`/api/exams/${id}`, {
        method: "PUT",
        body: JSON.stringify(examData),
    });
};

/**
 * Delete exam
 */
export const deleteExam = (id) => {
    return fetchAPI(`/api/exams/${id}`, {
        method: "DELETE",
    });
};

/**
 * Publish/Unpublish exam
 */
export const publishExam = (id) => {
    return fetchAPI(`/api/exams/${id}/publish`, {
        method: "PATCH",
    });
};

/**
 * Get exam submissions (for teachers)
 */
export const getExamSubmissions = (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/exams/${id}/submissions${query ? `?${query}` : ""}`);
};

/**
 * Get exam statistics
 */
export const getExamStats = (id) => {
    return fetchAPI(`/api/exams/${id}/stats`);
};

/**
 * Download question paper
 */
export const downloadQuestionPaper = async (examId) => {
    const url = `${API_BASE_URL}/api/exams/${examId}/question-paper`;
    
    const token = getAuthToken();
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw {
            status: response.status,
            message: data.message || "File download failed"
        };
    }

    return response.blob();
};

// Student Exam APIs

/**
 * Get available exams for student
 */
export const getStudentExams = (courseId = null) => {
    const endpoint = courseId 
        ? `/api/exams/student/available?courseId=${courseId}` 
        : "/api/exams/student/available";
    return fetchAPI(endpoint);
};

/**
 * Get student's submission for an exam
 */
export const getMySubmission = (examId) => {
    return fetchAPI(`/api/exams/${examId}/my-submission`);
};

/**
 * Get student's all submissions
 */
export const getMySubmissions = (courseId = null) => {
    const endpoint = courseId 
        ? `/api/exams/my-submissions?courseId=${courseId}` 
        : "/api/exams/my-submissions";
    return fetchAPI(endpoint);
};

/**
 * Submit exam (upload answer file)
 */
export const submitExam = async (examId, file) => {
    const url = `${API_BASE_URL}/api/exams/${examId}/submit`;
    
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || "File upload failed"
        };
    }

    return data;
};

/**
 * Download student's answer file (for teachers)
 */
export const downloadAnswerFile = async (submissionId) => {
    const url = `${API_BASE_URL}/api/exams/submission/${submissionId}/download`;
    
    const token = getAuthToken();
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw {
            status: response.status,
            message: data.message || "File download failed"
        };
    }

    return response.blob();
};

/**
 * Grade submission
 */
export const gradeSubmission = async (submissionId, obtainedMarks, feedback = '') => {
    return fetchAPI(`/api/exams/submission/${submissionId}/grade`, {
        method: 'POST',
        body: JSON.stringify({
            obtainedMarks,
            feedback
        })
    });
};

/**
 * Publish single result
 */
export const publishResult = (submissionId) => {
    return fetchAPI(`/api/exams/submission/${submissionId}/publish`, {
        method: 'POST'
    });
};

/**
 * Publish all results for an exam
 */
export const publishAllResults = (examId) => {
    return fetchAPI(`/api/exams/${examId}/publish-all`, {
        method: 'POST'
    });
};

/**
 * Get submission details (for teachers)
 */
export const getSubmissionDetails = (submissionId) => {
    return fetchAPI(`/api/exams/submission/${submissionId}/details`);
};

// ================= LEGACY API (for backward compatibility) =================
// These are kept for compatibility with existing code but map to new endpoints

/**
 * @deprecated Use getExamSubmissions instead
 */
export const getExamResults = (id) => {
    return getExamSubmissions(id);
};

/**
 * @deprecated Use gradeSubmission instead
 */
export const gradeExam = async (attemptId, obtainedMarks, overallFeedback = '') => {
    return gradeSubmission(attemptId, obtainedMarks, overallFeedback);
};

/**
 * @deprecated Use gradeSubmission instead
 */
export const gradeExamAnswer = async (attemptId, questionId, marksObtained, gradingNotes = '') => {
    return gradeSubmission(attemptId, marksObtained, gradingNotes);
};

/**
 * @deprecated Use publishResult instead
 */
export const publishExamResult = (attemptId) => {
    return publishResult(attemptId);
};

/**
 * @deprecated Use publishAllResults instead
 */
export const publishAllExamResults = (examId) => {
    return publishAllResults(examId);
};

/**
 * @deprecated Use getSubmissionDetails instead
 */
export const getAttemptDetails = (attemptId) => {
    return getSubmissionDetails(attemptId);
};

/**
 * @deprecated No longer needed - exams are not timed
 */
export const startExamAttempt = async () => {
    throw new Error("Not applicable for manual exams");
};

/**
 * @deprecated Use submitExam instead
 */
export const submitExamAttempt = async () => {
    throw new Error("Not applicable for manual exams");
};

/**
 * @deprecated Use submitExam instead
 */
export const uploadExamFile = async () => {
    throw new Error("Not applicable for manual exams");
};

/**
 * @deprecated Use getMySubmissions instead
 */
export const getMyAttempts = () => {
    return getMySubmissions();
};

/**
 * @deprecated Use getMyAttempts instead
 */
export const getMyExamAttempts = () => {
    return getMySubmissions();
};

/**
 * @deprecated No longer needed - exams are not timed
 */
export const sendHeartbeat = async () => {
    throw new Error("Not applicable for manual exams");
};

/**
 * @deprecated No longer needed - no violations in manual exams
 */
export const reportViolation = async () => {
    throw new Error("Not applicable for manual exams");
};

/**
 * @deprecated Use getStudentExams instead
 */
export const getStudentExamResults = () => {
    return getMySubmissions();
};

// ================= EXPORT =================

export default {
    // Teacher Exam Management
    createExam,
    uploadQuestionPaper,
    getTeacherExams,
    getExam,
    getExamWithQuestions: getExam,
    updateExam,
    deleteExam,
    publishExam,
    getExamSubmissions,
    getExamResults: getExamSubmissions,
    getExamStats,
    downloadQuestionPaper,
    
    // Student Exam APIs
    getStudentExams,
    getMySubmission,
    getMySubmissions,
    submitExam,
    downloadAnswerFile,
    
    // Grading APIs
    gradeSubmission,
    gradeExam,
    gradeExamAnswer,
    publishResult,
    publishExamResult,
    publishAllResults,
    publishAllExamResults,
    getSubmissionDetails,
    getAttemptDetails,
    
    // Legacy/Broken APIs (kept for compatibility)
    startExamAttempt,
    submitExamAttempt,
    uploadExamFile,
    getMyAttempts,
    getMyExamAttempts,
    sendHeartbeat,
    reportViolation,
    getStudentExamResults,
    
    // Config
    getBackendURL
};

