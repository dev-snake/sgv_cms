import axios from "axios";
import Cookies from "js-cookie";
import { SITE_ROUTES, API_ROUTES } from "@/constants/routes";

const axiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add accessToken from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't refresh if we are already trying to login or refresh
      if (originalRequest.url.includes(API_ROUTES.AUTH.LOGIN) || originalRequest.url.includes(API_ROUTES.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

      try {
        // Try to refresh session - refreshToken is HttpOnly cookie, so we don't need body
        const refreshRes = await axios.post(API_ROUTES.AUTH.REFRESH);
        
        if (refreshRes.data.success) {
          // The new accessToken is already in the cookies (set by server)
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login if we are in the portal
        if (typeof window !== "undefined") {
          const isPortal = window.location.pathname.startsWith("/portal");
          if (isPortal) {
            window.location.href = SITE_ROUTES.LOGIN;
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
