import { apiClient } from '$/libs/axios.js';

export const submitResponse = async ({ pollId, answers }) => {
    const { data } = await apiClient.post(`/polls/${pollId}/respond`, { answers });
    return data;
};
