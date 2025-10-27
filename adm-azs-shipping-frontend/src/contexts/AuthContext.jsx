import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/authService';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const token = await loginUser(username, password); 
            
            setToken(token);
            localStorage.setItem('authToken', token);
            return true; 
        } catch (error) {
            console.error("Falha no login (Context):", error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    };

    const value = {
        token,
        isAuthenticated: !!token, 
        login,
        logout,
        loading
    };

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};