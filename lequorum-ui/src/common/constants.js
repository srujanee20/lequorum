export const SOCKET_EVENTS = {
    JOIN_POLL: 'join_poll',
    LEAVE_POLL: 'leave_poll',
    UPDATE_COUNT: 'update_count',
    UPDATE_ANALYTICS: 'update_analytics'
};

export const queryKeys = {
    polls: {
        all: ['polls'],
        detail: (id) => ['polls', id],
        analytics: (id) => ['polls', id, 'analytics']
    }
};
