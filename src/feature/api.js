import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization header to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userDataString = localStorage.getItem('leafUser');
      if (userDataString && userDataString !== 'undefined' && userDataString !== 'null') {
        const user = JSON.parse(userDataString);
        if (user && user.access_leaf) {
          config.headers.Authorization = `Bearer ${user.access_leaf}`;
        }
      }
    } catch (error) {
      // If parsing fails, continue without auth header
      console.error('Auth token parse error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally - DISABLED auto-logout for now
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Temporarily disabled auto-logout to debug
    // Just log the error and continue
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - but not logging out:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export const get = async (url, config) => {
  const response = await axiosInstance.get(url, config || null);
  return response.data;
};

export const post = async (url, data, config) => {
  const response = await axiosInstance.post(url, data, config || null);  
  return response.data;
};


export const update = async (url, data, config) => {
  const response = await axiosInstance.put(url, data, config || null);
  return response;
};

export const patch = async (url, data, config) => {
  const response = await axiosInstance.patch(url, data, config || null);
  return response;
};

export const remove = async (url, config) => {
  const response = await axiosInstance.delete(url, config || null);
  return response.data;
};
