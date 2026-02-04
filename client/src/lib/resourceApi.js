import axios from 'axios';

const API_URL = '/api/resources';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
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

/* ==================== STUDENT API ==================== */

// Get all resources (for students - shows all teacher uploads)
export const getAllResources = async (params = {}) => {
    try {
        const { fileType, search } = params;
        const queryParams = new URLSearchParams();
        if (fileType && fileType !== 'all') queryParams.append('fileType', fileType);
        if (search) queryParams.append('search', search);

        const response = await api.get(`/?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Download resource file
export const downloadResource = async (resourceId) => {
    try {
        const response = await api.get(`/${resourceId}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* ==================== TEACHER API ==================== */

// Get teacher's own resources
export const getTeacherResources = async () => {
    try {
        const token = localStorage.getItem('token');
        // Decode token to get teacher ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        const response = await api.get(`/teacher/me?teacherId=${payload.id}`);
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

/* ==================== ADMIN API ==================== */

// Get all resources (admin - shows everything)
export const getAllResourcesAdmin = async (params = {}) => {
    try {
        const { fileType, search, uploadedBy } = params;
        const queryParams = new URLSearchParams();
        if (fileType && fileType !== 'all') queryParams.append('fileType', fileType);
        if (search) queryParams.append('search', search);
        if (uploadedBy && uploadedBy !== 'all') queryParams.append('uploadedBy', uploadedBy);

        const response = await api.get(`/admin/all?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Update any resource (admin)
export const updateResourceAdmin = async (id, formData) => {
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

// Delete any resource (admin)
export const deleteResourceAdmin = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export default {
    getAllResources,
    downloadResource,
    getTeacherResources,
    createResource,
    updateResource,
    deleteResource,
    getAllResourcesAdmin,
    updateResourceAdmin,
    deleteResourceAdmin,
};

