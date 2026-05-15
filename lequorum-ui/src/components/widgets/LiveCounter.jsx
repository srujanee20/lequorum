import { useState, useEffect } from 'react';
import { HStack, Text, Box } from '@chakra-ui/react';
import { useSocket } from '$/contexts/SocketContext.jsx';
import { SOCKET_EVENTS } from '$/common/constants.js';

const LiveCounter = ({ pollId, initialCount = 0 }) => {
    const [count, setCount] = useState(initialCount);
    const socketRef = useSocket();

    useEffect(() => {
        const socket = socketRef?.current;
        if (!socket) return;

        socket.emit(SOCKET_EVENTS.JOIN_POLL, pollId);
        socket.on(SOCKET_EVENTS.UPDATE_COUNT, ({ total }) => setCount(total));

        return () => {
            socket.emit(SOCKET_EVENTS.LEAVE_POLL, pollId);
            socket.off(SOCKET_EVENTS.UPDATE_COUNT);
        };
    }, [pollId, socketRef]);

    return (
        <HStack gap={2}>
            <Box position="relative" w="8px" h="8px">
                <Box
                    position="absolute"
                    inset={0}
                    borderRadius="full"
                    bg="#576F6A"
                    opacity={0.4}
                    animation="ping 1.5s cubic-bezier(0,0,0.2,1) infinite"
                    css={{
                        '@keyframes ping': { '75%,100%': { transform: 'scale(2)', opacity: 0 } }
                    }}
                />
                <Box borderRadius="full" w="8px" h="8px" bg="#576F6A" />
            </Box>
            <Text fontSize="sm" color="#78716C">
                <Text as="span" fontWeight="600" color="#1C1917">
                    {count}
                </Text>{' '}
                response{count !== 1 ? 's' : ''}
            </Text>
        </HStack>
    );
};

export default LiveCounter;
