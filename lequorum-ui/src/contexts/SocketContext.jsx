import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_BASE_URL);
        return () => socketRef.current?.disconnect();
    }, []);

    return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>;
};

const useSocket = () => useContext(SocketContext);

export { SocketProvider, useSocket };
