import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'owner' | 'partner' | null;
    coupleId: string | null;
    isPro: boolean;
    planType: 'free' | 'mensal' | 'anual' | 'vitalicio';
    planExpiresAt: string | null;
    partnerEmail: string | null;
    source?: string;
    marketingOptIn?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string, marketingOptIn?: boolean) => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;

    // Couple actions
    createCouple: () => Promise<void>;
    invitePartner: (email: string) => Promise<any>;
    acceptInvite: (token: string) => Promise<void>;
    checkPlanStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: true,

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    register: async (email: string, password: string, name?: string, marketingOptIn: boolean = true) => {
        try {
            const response = await api.post('/auth/register', { email, password, name, marketingOptIn });
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    googleLogin: async (token: string) => {
        try {
            const response = await api.post('/auth/google-login', { token });
            const { token: jwtToken, user } = response.data;

            localStorage.setItem('auth_token', jwtToken);
            set({ user, token: jwtToken, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = '/'; // Redirect to home
    },

    checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            set({ isLoading: false });
            return;
        }

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('auth_token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    },

    createCouple: async () => {
        try {
            const response = await api.post('/api/couple/create');
            // Refresh user data to get the new coupleId and role
            await get().checkAuth();
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    invitePartner: async (email: string) => {
        try {
            const response = await api.post('/api/couple/invite', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    acceptInvite: async (token: string) => {
        try {
            const response = await api.post(`/api/couple/accept/${token}`);
            // Refresh user data to update role and coupleId
            await get().checkAuth();
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkPlanStatus: async () => {
        try {
            const response = await api.get('/api/couple/plan');
            const { planType, planExpiresAt, isPro } = response.data;

            set((state: AuthState) => ({
                user: state.user ? { ...state.user, planType, planExpiresAt, isPro } : null
            }));
        } catch (error) {
            console.error("Failed to check plan status", error);
        }
    }
}));
