import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TombolaProtected from './TombolaProtected';
import NotFound from './NotFound';

// Secret token pour l'accès développeur à la tombola
// Token: dev-mehdi-tombola-2026-secret
const TOMBOLA_SECRET_TOKEN = 'dev-mehdi-tombola-2026-secret';

const TombolaSecret = () => {
    const { token } = useParams<{ token: string }>();

    // Vérifier que le token est correct
    if (token !== TOMBOLA_SECRET_TOKEN) {
        return <NotFound />;
    }

    // Si le token est correct, afficher la page Tombola
    return <TombolaProtected />;
};

export default TombolaSecret;
