import api from './axios';
import { z } from 'zod';

// Zod schemas for validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}

export const authApi = {
    login: async (data: LoginInput) => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterInput) => {
        const payload = {
            email: data.email,
            password: data.password,
            name: data.fullName
        };
        const response = await api.post<AuthResponse>('/auth/register', payload);
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
    },

    refresh: async () => {
        const response = await api.get<AuthResponse>('/auth/me');
        return response.data;
    }
};
