import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response, // if the response is OK, just pass it through
  async error => {
    const originalRequest = error.config;
    // Check if error is due to an expired token (status 401 with token_not_valid)
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loops
      try {
        // Attempt to refresh the token
        await axiosInstance.post("/user/token-refresh/", {}, { withCredentials: true });
        // After refreshing, reattempt the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear cookies and redirect to login
        document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = "/user/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
