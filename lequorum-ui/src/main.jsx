import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '$/contexts/AuthContext.jsx';
import { SocketProvider } from '$/contexts/SocketContext.jsx';
import AppToaster from '$components/ui/AppToaster.jsx';
import { system } from '$/themes/system.js';
import App from '$components/App.jsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 30,
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider value={system}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <SocketProvider>
                        <App queryClient={queryClient} />
                        <AppToaster />
                    </SocketProvider>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>
);
