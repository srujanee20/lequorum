import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
    headers: {
        Accept: 'application/json'
    },
    timeout: 60000
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('lq_token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    res => res,
    err => {
        // Redirect to login page unless already on the login page
        if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
            localStorage.removeItem('lq_token');
            localStorage.removeItem('lq_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);
