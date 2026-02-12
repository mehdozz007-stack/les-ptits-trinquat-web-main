import { useState, useEffect, useCallback } from 'react';
import { apiUrl } from '@/lib/api-config';

const TOKEN_STORAGE_KEY = 'tombola_auth_token';
const USER_STORAGE_KEY = 'tombola_current_user';

export interface CurrentUser {
    id: string;
    email: string;
    token: string;
}

/**
 * Hook pour gérer l'authentification utilisateur
 * Stocke le token et les infos utilisateur dans localStorage
 * Vérifie la validité du token au chargement
 */
export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Vérifier l'authentification au chargement
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Vérifier que le token est valide
                const response = await fetch(apiUrl('/api/auth/me'), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    // Token invalide
                    localStorage.removeItem(TOKEN_STORAGE_KEY);
                    localStorage.removeItem(USER_STORAGE_KEY);
                    setUser(null);
                    return;
                }

                const data = await response.json();
                if (data.success && data.data) {
                    const currentUser: CurrentUser = {
                        id: data.data.id,
                        email: data.data.email,
                        token
                    };
                    setUser(currentUser);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem(USER_STORAGE_KEY);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Écouter les changements de localStorage (connexion/déconnexion dans un autre onglet ou un autre composant)
        const handleStorageChange = () => {
            checkAuth();
        };

        // Écouter l'event personnalisé pour les changements dans le même onglet
        const handleAuthStateChanged = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authStateChanged', handleAuthStateChanged);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authStateChanged', handleAuthStateChanged);
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Login failed');
            }

            const currentUser: CurrentUser = {
                id: data.data.user.id,
                email: data.data.user.email,
                token: data.data.token
            };

            localStorage.setItem(TOKEN_STORAGE_KEY, data.data.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
            setUser(currentUser);

            // Dispatcher un event personnalisé pour synchroniser les autres composants
            window.dispatchEvent(new Event('authStateChanged'));

            return { success: true, user: currentUser };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Login failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (email: string, password: string, passwordConfirm: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, password_confirm: passwordConfirm })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Registration failed');
            }

            // Récupérer le token depuis la réponse
            const token = data.data.token;
            const userId = data.data.user.id;
            const userEmail = data.data.user.email;

            if (!token) {
                throw new Error('No token received from registration');
            }

            // Sauvegarder le token et l'utilisateur (auto-login)
            const currentUser: CurrentUser = {
                id: userId,
                email: userEmail,
                token
            };

            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
            setUser(currentUser);

            // Dispatcher un event personnalisé pour synchroniser les autres composants
            window.dispatchEvent(new Event('authStateChanged'));

            return { success: true, userId: userId };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
        setError(null);

        // Dispatcher un event personnalisé pour synchroniser les autres composants
        window.dispatchEvent(new Event('authStateChanged'));
    }, []);

    return {
        user,
        userId: user?.id || null,
        token: user?.token || null,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
}
