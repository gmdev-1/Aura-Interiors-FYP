// services/axiosInstance.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Flag to avoid multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  resp => resp,
  err => {
    const originalReq = err.config;

    // If 401 on any endpoint except token-refresh itself
    if (err.response?.status === 401 && !originalReq._retry) {
      if (originalReq.url.includes('/user/token-refresh/')) {
        // Refresh also failed → user must log in again
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // Queue other calls while one refresh is in flight
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalReq.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalReq);
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      // Attempt refresh
      return new Promise((resolve, reject) => {
        axiosInstance.post('/user/token-refresh/')
          .then(({ data }) => {
            processQueue(null, data.access);
            originalReq.headers['Authorization'] = 'Bearer ' + data.access;
            resolve(axiosInstance(originalReq));
          })
          .catch(refreshErr => {
            processQueue(refreshErr, null);
            reject(refreshErr);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
