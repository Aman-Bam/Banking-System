import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g., check local storage or make an API call)
        // Since we use httpOnly cookies, we might need a /me endpoint to check auth status.
        // For now, let's assume we persuade the user to login if state is empty, 
        // or we can persist user info in localStorage (but not token).
        // A better approach with cookies is to try to fetch user profile on load.
        // If backend doesn't have /me, we rely on login response.
        // Let's check localStorage for now to persist "UI state" of being logged in,
        // but actual calls will fail if cookie is expired.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginApi({ email, password });
            setUser(data.user);
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
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
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
