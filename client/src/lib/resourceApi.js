/* ================= CONFIG ================= */

// Get backend URL from environment variable or use fallback for development
const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  // Return the environment URL if it exists and is valid, otherwise use fallback
  if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
    return envUrl.replace(/\/+$/, ''); // Remove trailing slashes
  }
  // Fallback URLs based on the deployment
  if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
    return 'https://mdai-self.vercel.app';
  }
  // Development fallback
  return 'http://localhost:5000';
};

const API_BASE_URL = getBackendURL();

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

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return [];
      }
      const errorData = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    // Return empty array for resource endpoints to prevent map errors
    if (endpoint.includes('/api/resource')) {
      return [];
    }
    throw error;
  }
};

/* ================= RESOURCE APIs ================= */

export const getAllResources = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(
    `/api/resource${query ? `?${query}` : ""}`
  );
};

export const getResourceById = (id) => {
  return fetchAPI(`/api/resource/${id}`);
};

export const createResource = (resourceData) => {
  return fetchAPI("/api/resource", {
    method: "POST",
    body: JSON.stringify(resourceData),
  });
};

export const updateResource = (id, resourceData) => {
  return fetchAPI(`/api/resource/${id}`, {
    method: "PUT",
    body: JSON.stringify(resourceData),
  });
};

export const deleteResource = (id) => {
  return fetchAPI(`/api/resource/${id}`, {
    method: "DELETE",
  });
};

/* ================= EXPORT ================= */

export default {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};

