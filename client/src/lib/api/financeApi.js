import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const teacherFinanceApi = axios.create({
    baseURL: `${API_URL}/teacher`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests
teacherFinanceApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("teacherToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle auth errors
teacherFinanceApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("teacherToken");
            window.location.href = "/teacher/login";
        }
        return Promise.reject(error);
    }
);

/* ======================================================
   GET TEACHER FINANCE STATS
====================================================== */
export const getTeacherFinanceStats = async () => {
    const response = await teacherFinanceApi.get("/finance/stats");
    return response.data;
};

/* ======================================================
   GET TEACHER FINANCE TRANSACTIONS
====================================================== */
export const getTeacherTransactions = async (params = {}) => {
    const { page = 1, limit = 20, type, status, startDate, endDate } = params;
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...(type && { type }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });
    
    const response = await teacherFinanceApi.get(`/finance/transactions?${queryParams}`);
    return response.data;
};

/* ======================================================
   GET TEACHER COURSE EARNINGS
====================================================== */
export const getTeacherCourseEarnings = async () => {
    const response = await teacherFinanceApi.get("/finance/course-earnings");
    return response.data;
};

/* ======================================================
   GET TEACHER MONTHLY EARNINGS
====================================================== */
export const getTeacherMonthlyEarnings = async (months = 12) => {
    const response = await teacherFinanceApi.get(`/finance/monthly-earnings?months=${months}`);
    return response.data;
};

/* ======================================================
   GET TEACHER FINANCE SUMMARY
====================================================== */
export const getTeacherFinanceSummary = async () => {
    const response = await teacherFinanceApi.get("/finance/summary");
    return response.data;
};

export default teacherFinanceApi;

