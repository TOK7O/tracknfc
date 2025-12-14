import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type {AuthState} from '../types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = async () => {
        try {
            await api.auth.me();
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
        }
    };

    const login = async (password: string) => {
        try {
            await api.auth.login(password);
            setIsAuthenticated(true);
            return true;
        } catch (e) {
            return false;
        }
    };

    const logout = async () => {
        await api.auth.logout();
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkAuth, login, logout }}>
    {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error();
    }
    return context;
}