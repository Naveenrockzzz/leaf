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
    const user = JSON.parse(localStorage.getItem('leafUser') || '{}');
    if (user.access_leaf) {
      config.headers.Authorization = `Bearer ${user.access_leaf}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('leafUser');
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
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
