import { useState, useEffect } from "react";
import { authApi, authManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminAuthState {
  user: any | null;
  email: string | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    email: null,
    isAdmin: false,
    isLoading: true,
  });
  const { toast } = useToast();

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = async () => {
      if (authManager.isAuthenticated()) {
        try {
          const result = await authApi.getMe();
          if (result.success && result.data) {
            setAuthState({
              user: result.data,
              email: result.data.email,
              isAdmin: result.data.role === "admin",
              isLoading: false,
            });
          } else {
            authManager.clearToken();
            setAuthState({
              user: null,
              email: null,
              isAdmin: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          authManager.clearToken();
          setAuthState({
            user: null,
            email: null,
            isAdmin: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          email: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await authApi.login(email, password);

      if (!result.success) {
        toast({
          title: "Connexion échouée",
          description: result.error || "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return { error: new Error(result.error) };
      }

      if (result.data?.token) {
        authManager.setToken(result.data.token);
        setAuthState({
          user: result.data.user,
          email: result.data.user?.email,
          isAdmin: result.data.user?.role === "admin",
          isLoading: false,
        });

        toast({
          title: "Connecté !",
          description: "Bienvenue dans l'administration",
        });
      }

      return { error: null };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur de connexion";
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

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await authApi.signup(email, password);

      if (!result.success) {
        toast({
          title: "Inscription échouée",
          description: result.error || "Erreur lors de l'inscription",
          variant: "destructive",
        });
        return { error: new Error(result.error) };
      }

      if (result.data?.token) {
        authManager.setToken(result.data.token);
        setAuthState({
          user: result.data.user,
          email: result.data.user?.email,
          isAdmin: result.data.user?.role === "admin",
          isLoading: false,
        });

        toast({
          title: "Compte créé !",
          description: "Vous pouvez maintenant vous connecter",
        });
      }

      return { error: null };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur d'inscription";
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
      console.error("Logout error:", error);
    } finally {
      authManager.clearToken();
      setAuthState({
        user: null,
        email: null,
        isAdmin: false,
        isLoading: false,
      });
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}
