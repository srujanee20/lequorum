import { apiClient } from '$/libs/axios.js';

export const login = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
};

export const register = async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
};
