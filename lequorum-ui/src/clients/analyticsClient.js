import { apiClient } from '$/libs/axios.js';

export const getAnalytics = async (pollId) => {
    const { data } = await apiClient.get(`/polls/${pollId}/analytics`);
    return data;
};
