import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from './useCurrentUser';

/**
 * Hook pour protéger les routes tombola
 * Vérifie que l'utilisateur est authentifié
 * Redirige vers /auth sinon
 */
export function useProtectedRoute() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: userLoading, token } = useCurrentUser();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Attendre que l'auth soit vérifiée
        if (userLoading) {
            return;
        }

        // Si pas authentifié, rediriger vers /auth
        if (!isAuthenticated || !user || !token) {
            navigate('/auth', { replace: true });
            return;
        }

        // Authentifié, route protégée accessible
        setIsReady(true);
    }, [isAuthenticated, user, token, userLoading, navigate]);

    return {
        isReady,
        isLoading: userLoading,
        user,
        token,
    };
}
