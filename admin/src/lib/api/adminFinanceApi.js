import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const adminFinanceApi = axios.create({
    baseURL: `${API_URL}/api/admin`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests
adminFinanceApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
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
adminFinanceApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

/* ======================================================
   GET ALL FINANCE TRANSACTIONS
====================================================== */
export const getAllFinanceTransactions = async (params = {}) => {
    const { page = 1, limit = 20, type, status, teacherId, startDate, endDate } = params;
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...(type && { type }),
        ...(status && { status }),
        ...(teacherId && { teacherId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });
    
    const response = await adminFinanceApi.get(`/finance/transactions?${queryParams}`);
    return response.data;
};

/* ======================================================
   GET ADMIN FINANCE STATS
====================================================== */
export const getAdminFinanceStats = async () => {
    const response = await adminFinanceApi.get("/finance/stats");
    return response.data;
};

/* ======================================================
   GET ALL TEACHERS WITH EARNINGS
====================================================== */
export const getAllTeachersWithEarnings = async () => {
    const response = await adminFinanceApi.get("/finance/teachers-earnings");
    return response.data;
};

/* ======================================================
   GET REVENUE REPORT
====================================================== */
export const getAdminRevenueReport = async (period = "30days") => {
    const response = await adminFinanceApi.get(`/finance/revenue-report?period=${period}`);
    return response.data;
};

export default adminFinanceApi;

