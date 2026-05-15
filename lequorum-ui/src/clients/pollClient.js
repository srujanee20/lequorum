import { apiClient } from '$/libs/axios.js';

export const getUserPolls = async (userId) => {
    const { data } = await apiClient.get(`/polls/user/${userId}`);
    return data;
};

export const getActivePolls = async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/polls/active?page=${page}&limit=${limit}`);
    return data;
};

export const getPollById = async (pollId) => {
    const { data } = await apiClient.get(`/polls/${pollId}`);
    return data;
};

export const createPoll = async (pollData) => {
    const { data } = await apiClient.post('/polls', pollData);
    return data;
};

export const publishPoll = async (pollId) => {
    const { data } = await apiClient.patch(`/polls/${pollId}/publish`);
    return data;
};

export const deletePoll = async (pollId) => {
    const { data } = await apiClient.delete(`/polls/${pollId}`);
    return data;
};
