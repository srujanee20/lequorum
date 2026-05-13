import { Server } from 'socket.io';
import { SocketEvents } from '../common/constants.js';

let io;

export const init = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        socket.on(SocketEvents.JOIN_POLL, (pollId) => {
            socket.join(pollId);
        });

        socket.on(SocketEvents.LEAVE_POLL, (pollId) => {
            socket.leave(pollId);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io)
        throw new Error('Socket.io has not been initialized');
    return io;
};