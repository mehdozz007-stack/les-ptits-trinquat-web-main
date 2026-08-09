import { useState, useEffect } from "react";
import { authApi, authManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface UnifiedAdminUser {
    email: string;
    role: "admin" | "newsletter_admin" | "tombola_admin";
    name?: string;
    id?: string;
}

interface UnifiedAuthState {
    user: UnifiedAdminUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export function useUnifiedAdminAuth() {
    const [authState, setAuthState] = useState<UnifiedAuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });
    const { toast } = useToast();

    // Vérifier l'authentification au montage
    useEffect(() => {
        const checkAuth = async () => {
            console.log('[useUnifiedAdminAuth] Vérification de l\'authentification...');

            const storedAuth = localStorage.getItem('unified_admin_auth');
            if (storedAuth) {
                try {
                    const parsed = JSON.parse(storedAuth);
                    setAuthState({
                        user: parsed,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                    return;
                } catch (e) {
                    console.error('[useUnifiedAdminAuth] Erreur parsing auth:', e);
                }
            }

            // Vérifier via le token d'authentification newsletter
            if (authManager.isAuthenticated()) {
                try {
                    const result = await authApi.getMe();
                    console.log('[useUnifiedAdminAuth] getMe result:', result);

                    if (result.success && result.data) {
                        const user: UnifiedAdminUser = {
                            email: result.data.email,
                            role: "admin",
                            name: result.data.name,
                            id: result.data.id,
                        };

                        localStorage.setItem('unified_admin_auth', JSON.stringify(user));
                        setAuthState({
                            user,
                            isLoading: false,
                            isAuthenticated: true,
                        });
                    } else {
                        authManager.clearToken();
                        setAuthState({
                            user: null,
                            isLoading: false,
                            isAuthenticated: false,
                        });
                    }
                } catch (error) {
                    console.error("[useUnifiedAdminAuth] Auth check error:", error);
                    authManager.clearToken();
                    setAuthState({
                        user: null,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        };

        checkAuth();
    }, []);

    const signIn = async (email: string, password: string): Promise<{ error?: Error }> => {
        console.log('[useUnifiedAdminAuth] signIn appelé pour:', email);
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const result = await authApi.login(email, password);
            console.log('[useUnifiedAdminAuth] login result:', { success: result.success });

            if (!result.success) {
                const errorMsg = result.error || "Email ou mot de passe incorrect";
                console.error('[useUnifiedAdminAuth] Login failed:', errorMsg);

                toast({
                    title: "Connexion échouée",
                    description: errorMsg,
                    variant: "destructive",
                });

                return { error: new Error(errorMsg) };
            }

            if (result.data?.token) {
                console.log('[useUnifiedAdminAuth] Token reçu, sauvegarde en cours...');
                console.log('[useUnifiedAdminAuth] Token value:', result.data.token.substring(0, 30) + '...');

                authManager.setToken(result.data.token);
                // Stocker aussi comme admin_token pour compatibilité TombolaAPI
                localStorage.setItem('admin_token', result.data.token);

                // Vérifier que les tokens ont bien été sauvegardés
                console.log('[useUnifiedAdminAuth] Tokens saved:', {
                    auth_token: !!localStorage.getItem('auth_token'),
                    admin_token: !!localStorage.getItem('admin_token'),
                });

                const userData = result.data.user;
                const user: UnifiedAdminUser = {
                    email: userData?.email || email,
                    role: "admin",
                    name: userData?.name,
                    id: userData?.id,
                };

                console.log('[useUnifiedAdminAuth] User data:', { email: user.email, role: user.role });
                localStorage.setItem('unified_admin_auth', JSON.stringify(user));

                setAuthState({
                    user,
                    isLoading: false,
                    isAuthenticated: true,
                });

                toast({
                    title: "Connecté !",
                    description: "Bienvenue dans l'administration",
                });
            } else {
                console.error('[useUnifiedAdminAuth] Pas de token dans la réponse:', result.data);
                return { error: new Error("Pas de token reçu du serveur") };
            }

            return { error: undefined };
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Erreur de connexion";
            console.error('[useUnifiedAdminAuth] Exception:', errorMsg);

            toast({
                title: "Erreur",
                description: errorMsg,
                variant: "destructive",
            });

            return { error: new Error(errorMsg) };
        } finally {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const signOut = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("[useUnifiedAdminAuth] Logout error:", error);
        } finally {
            authManager.clearToken();
            localStorage.removeItem('unified_admin_auth');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('tombola_auth_token');
            localStorage.removeItem('tombola_auth');

            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    return {
        ...authState,
        signIn,
        signOut,
    };
}
