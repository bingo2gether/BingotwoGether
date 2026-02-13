import { create } from 'zustand';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
    type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebaseConfig';
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
    firebaseUser: FirebaseUser | null;

    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string, marketingOptIn?: boolean) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    initAuthListener: () => () => void;

    // Couple actions
    createCouple: () => Promise<void>;
    invitePartner: (email: string) => Promise<any>;
    acceptInvite: (token: string) => Promise<void>;
    checkPlanStatus: () => Promise<void>;
}

// Helper: sync user with backend after Firebase auth
async function syncWithBackend(firebaseUser: FirebaseUser): Promise<{ token: string; user: User }> {
    const idToken = await firebaseUser.getIdToken();

    // Set token for API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

    try {
        // Try to sync/create user on backend
        const response = await api.post('/auth/firebase-sync', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || undefined,
            source: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
        });
        return { token: idToken, user: response.data.user };
    } catch (error: any) {
        // If backend is unreachable, create a local-only user profile
        console.warn('Backend sync failed, using Firebase-only auth:', error.message);
        return {
            token: idToken,
            user: {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || undefined,
                role: null,
                coupleId: null,
                isPro: false,
                planType: 'free',
                planExpiresAt: null,
                partnerEmail: null,
                source: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
            }
        };
    }
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    firebaseUser: null,

    login: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const { token, user } = await syncWithBackend(credential.user);
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true, firebaseUser: credential.user });
    },

    register: async (email: string, password: string, name?: string, _marketingOptIn: boolean = true) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name in Firebase
        if (name) {
            await updateProfile(credential.user, { displayName: name });
        }

        const { token, user } = await syncWithBackend(credential.user);
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true, firebaseUser: credential.user });
    },

    googleLogin: async () => {
        const credential = await signInWithPopup(auth, googleProvider);
        const { token, user } = await syncWithBackend(credential.user);
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true, firebaseUser: credential.user });
    },

    logout: () => {
        signOut(auth);
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false, firebaseUser: null });
        window.location.href = '/';
    },

    checkAuth: async () => {
        // This is now handled by the auth listener, but keeping for compatibility
        const currentUser = auth.currentUser;
        if (!currentUser) {
            set({ isLoading: false });
            return;
        }

        try {
            const { token, user } = await syncWithBackend(currentUser);
            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true, isLoading: false, firebaseUser: currentUser });
        } catch (error) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    },

    initAuthListener: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const { token, user } = await syncWithBackend(firebaseUser);
                    localStorage.setItem('auth_token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false, firebaseUser });
                } catch (error) {
                    set({ isLoading: false });
                }
            } else {
                localStorage.removeItem('auth_token');
                set({ user: null, token: null, isAuthenticated: false, isLoading: false, firebaseUser: null });
            }
        });
        return unsubscribe;
    },

    createCouple: async () => {
        try {
            const response = await api.post('/couple/create');
            await get().checkAuth();
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    invitePartner: async (email: string) => {
        try {
            const response = await api.post('/couple/invite', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    acceptInvite: async (token: string) => {
        try {
            const response = await api.post(`/couple/accept/${token}`);
            await get().checkAuth();
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkPlanStatus: async () => {
        try {
            const response = await api.get('/couple/plan');
            const { planType, planExpiresAt, isPro } = response.data;

            set((state: AuthState) => ({
                user: state.user ? { ...state.user, planType, planExpiresAt, isPro } : null
            }));
        } catch (error) {
            console.error("Failed to check plan status", error);
        }
    }
}));
