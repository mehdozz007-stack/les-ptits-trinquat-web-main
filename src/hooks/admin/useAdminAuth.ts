import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, AuthError } from "@supabase/supabase-js";

interface UseAdminAuthReturn {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Vérifier l'état d'authentification au montage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        setUser(currentUser);

        // Vérifier si l'utilisateur est admin
        if (currentUser) {
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentUser.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleError) throw roleError;
          setIsAdmin(!!roleData);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(err as AuthError);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // S'abonner aux changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Vérifier le rôle admin après changement d'auth
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    }
  };

  return {
    user,
    isAdmin,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
  };
}
