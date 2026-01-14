import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here if needed (e.g., for auth tokens)
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config before request is sent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
