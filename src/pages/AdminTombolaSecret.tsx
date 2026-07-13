import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminTombola from './AdminTombola';
import NotFound from './NotFound';

// Secret token pour l'accès développeur à l'admin tombola
// Token: dev-mehdi-admin-tombola-2026-secret
const ADMIN_TOMBOLA_SECRET_TOKEN = 'dev-mehdi-admin-tombola-2026-secret';
const TOKEN_STORAGE_KEY = 'tombola_auth_token';

const AdminTombolaSecret = () => {
    const { token } = useParams<{ token: string }>();

    // useLayoutEffect s'exécute AVANT le rendu des composants enfants
    useLayoutEffect(() => {
        if (token === ADMIN_TOMBOLA_SECRET_TOKEN) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            // Dispatcher un événement pour forcer useCurrentUser à vérifier le token
            window.dispatchEvent(new Event('authStateChanged'));
        }
    }, [token]);

    // Vérifier que le token est correct
    if (token !== ADMIN_TOMBOLA_SECRET_TOKEN) {
        return <NotFound />;
    }

    // Si le token est correct, afficher la page Admin Tombola
    return <AdminTombola />;
};

export default AdminTombolaSecret;
