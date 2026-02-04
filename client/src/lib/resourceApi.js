import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api/resource`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle errors
const handleError = (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
};

/* ==================== TEACHER API ==================== */

// Get teacher's own resources
export const getTeacherResources = async (params = {}) => {
    try {
        const { search, fileType } = params;
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (fileType && fileType !== 'all') queryParams.append('fileType', fileType);
        
        const response = await api.get(`/teacher?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Create new resource (teacher)
export const createResource = async (formData) => {
    try {
        const response = await api.post('/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Update resource (teacher - own only)
export const updateResource = async (id, formData) => {
    try {
        const response = await api.put(`/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Delete resource (teacher - own only)
export const deleteResource = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Download resource file
export const downloadResource = async (resourceId) => {
    try {
        const response = await api.get(`/${resourceId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export default {
    getTeacherResources,
    createResource,
    updateResource,
    deleteResource,
    downloadResource,
};

