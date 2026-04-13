import React from 'react';
import { useParams } from 'react-router-dom';
import AdminTombola from './AdminTombola';
import NotFound from './NotFound';

// Secret token pour l'accès développeur à l'admin tombola
// Token: dev-mehdi-admin-tombola-2026-secret
const ADMIN_TOMBOLA_SECRET_TOKEN = 'dev-mehdi-admin-tombola-2026-secret';

const AdminTombolaSecret = () => {
    const { token } = useParams<{ token: string }>();

    // Vérifier que le token est correct
    if (token !== ADMIN_TOMBOLA_SECRET_TOKEN) {
        return <NotFound />;
    }

    // Si le token est correct, afficher la page Admin Tombola
    return <AdminTombola />;
};

export default AdminTombolaSecret;
