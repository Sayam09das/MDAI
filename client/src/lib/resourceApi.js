/* ================= CONFIG ================= */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

