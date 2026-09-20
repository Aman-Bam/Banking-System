import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';
import { useAuthStore } from '../store/auth.store';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                if (storedToken) {
                    useAuthStore.getState().login(parsedUser, storedToken);
                }
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginApi({ email, password });
            setUser(data.user);
            if (data.token) {
                localStorage.setItem('token', data.token);
                useAuthStore.getState().login(data.user, data.token);
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await registerApi({ name, email, password });
            setUser(data.user);
            if (data.token) {
                localStorage.setItem('token', data.token);
                useAuthStore.getState().login(data.user, data.token);
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token') || useAuthStore.getState().token;
            await logoutApi(token);
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            useAuthStore.getState().logout();
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
