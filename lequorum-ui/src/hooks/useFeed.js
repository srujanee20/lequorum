import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '$/contexts/SocketContext.jsx';
import { SOCKET_EVENTS } from '$/common/constants.js';
import useFetch from '$/hooks/useFetch.js';

const useFeed = (queryKey, queryFn, roomId, options = {}) => {
    const queryClient = useQueryClient();
    const socketRef = useSocket();

    const query = useFetch(queryKey, queryFn, { enabled: !!roomId, ...options });

    useEffect(() => {
        const socket = socketRef?.current;
        if (!socket || !roomId) return;

        socket.emit(SOCKET_EVENTS.JOIN_POLL, roomId);
        socket.on(SOCKET_EVENTS.UPDATE_ANALYTICS, (freshData) => {
            queryClient.setQueryData(queryKey, freshData);
        });

        return () => {
            socket.emit(SOCKET_EVENTS.LEAVE_POLL, roomId);
            socket.off(SOCKET_EVENTS.UPDATE_ANALYTICS);
        };
    }, [roomId, socketRef, queryClient, queryKey]);

    return query;
};

export default useFeed;
