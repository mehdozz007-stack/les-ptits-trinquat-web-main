// Adicionar au début du fichier AdminTombola.tsx pour du debug
console.log('=== DEBUG AdminTombola ===');
console.log('Auth:', { user, isLoading, isAuthenticated });
console.log('Tokens stored:', {
    admin_token: localStorage.getItem('admin_token')?.substring(0, 20) + '...',
    auth_token: localStorage.getItem('auth_token')?.substring(0, 20) + '...',
    unified_admin_auth: localStorage.getItem('unified_admin_auth'),
});

// Au moment du chargement des données
const loadData = async () => {
    console.log('Loading data with tokens:', {
        adminToken: localStorage.getItem('admin_token') ? '✓ Present' : '✗ Missing',
        authToken: localStorage.getItem('auth_token') ? '✓ Present' : '✗ Missing',
    });

    setLoading(true);
    try {
        console.log('Fetching participants...');
        const parentsList = await TombolaAPI.getAdminParents();
        console.log('Participants fetched:', parentsList);

        const lotsList = await TombolaAPI.getLots();
        console.log('Lots fetched:', lotsList);

        setParents(parentsList || []);
        setLots(lotsList || []);
    } catch (error) {
        console.error("Error loading data:", error);
        setMessage({
            type: 'error',
            title: 'Erreur de chargement',
            message: 'Impossible de charger les données',
            emoji: '⚠️'
        });
    } finally {
        setLoading(false);
    }
};
