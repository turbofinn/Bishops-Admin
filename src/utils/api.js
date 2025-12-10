/* eslint-disable prettier/prettier */
import axios from 'axios';

const api = axios.create({
    baseURL: ''
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bishops-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('bishops-refersh-token');
            if (refreshToken) {
                return new Promise((resolve, reject) => {
                    axios
                        .post('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/refresh-token', {
                            refreshToken: refreshToken
                        })
                        .then((response) => {
                            if (response.data?.tokenPair?.accessToken) {
                                const newAccessToken = response.data.tokenPair.accessToken;
                                const newRefreshToken = response.data.tokenPair.refreshToken;

                                localStorage.setItem('bishops-token', newAccessToken);
                                if (newRefreshToken) {
                                    localStorage.setItem('bishops-refersh-token', newRefreshToken);
                                }

                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                                processQueue(null, newAccessToken);
                                resolve(api(originalRequest));
                            } else {
                                processQueue(error, null);
                                reject(error);
                            }
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                });
            }
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            localStorage.removeItem('bishops-token');
            localStorage.removeItem('bishops-refersh-token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
