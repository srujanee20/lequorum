import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('lq_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = (token, userData) => {
        localStorage.setItem('lq_token', token);
        localStorage.setItem('lq_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('lq_token');
        localStorage.removeItem('lq_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
