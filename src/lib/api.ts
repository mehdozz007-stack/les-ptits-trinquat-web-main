/**
 * Configuration API REST - Cloudflare Workers D1
 * Remplace Supabase par une API REST optimisée
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

// Log les URLs pour debug
if (import.meta.env.DEV) {
    console.log('[API] Base URL:', API_BASE_URL);
}

/**
 * Effectue un appel API avec gestion d'erreur centralisée
 */
export async function apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('auth_token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Ajouter le token si disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            credentials: 'include',
            ...options,
            headers,
        });

        const json = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: json.error || `Erreur ${response.status}`,
            };
        }

        return {
            success: json.success || true,
            data: json.data || json,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur réseau';
        console.error('[API Error]', errorMessage, error);
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * API Newsletter - Gestion des abonnements
 */
export const newsletterApi = {
    /**
     * S'inscrire à la newsletter
     */
    async subscribe(email: string, firstName?: string, consent = true) {
        return apiCall('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({
                email,
                first_name: firstName,
                consent,
            }),
        });
    },

    /**
     * Se désinscrire de la newsletter
     */
    async unsubscribe(email: string) {
        return apiCall('/newsletter/unsubscribe', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    /**
     * Récupérer les abonnés (admin uniquement)
     */
    async getSubscribers() {
        return apiCall('/newsletter/admin/subscribers');
    },

    /**
     * Récupérer les newsletters (admin uniquement)
     */
    async getNewsletters() {
        return apiCall('/newsletter/admin/newsletters');
    },

    /**
     * Créer une newsletter (admin uniquement)
     */
    async createNewsletter(title: string, subject: string, content: string, previewText?: string) {
        return apiCall('/newsletter/admin/newsletters', {
            method: 'POST',
            body: JSON.stringify({
                title,
                subject,
                content,
                preview_text: previewText,
            }),
        });
    },

    /**
     * Envoyer une newsletter (admin uniquement)
     */
    async sendNewsletter(newsletterId: string) {
        return apiCall('/newsletter/admin/send', {
            method: 'POST',
            body: JSON.stringify({
                newsletter_id: newsletterId,
            }),
        });
    },

    /**
     * Envoyer un email de test (admin uniquement)
     */
    async sendTestEmail(newsletterId: string, testEmail: string) {
        return apiCall('/newsletter/admin/test-email', {
            method: 'POST',
            body: JSON.stringify({
                newsletter_id: newsletterId,
                test_email: testEmail,
            }),
        });
    },

    /**
     * Supprimer un abonné (admin uniquement)
     */
    async deleteSubscriber(subscriberId: string) {
        return apiCall(`/newsletter/admin/subscribers/${subscriberId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Basculer le statut d'un abonné (admin uniquement)
     */
    async toggleSubscriber(subscriberId: string, isActive: boolean) {
        return apiCall(`/newsletter/admin/subscribers/${subscriberId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_active: isActive,
            }),
        });
    },
};

/**
 * Auth API - Authentification
 */
export const authApi = {
    /**
     * Connexion
     */
    async login(email: string, password: string) {
        return apiCall<{ token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    /**
     * Inscription
     */
    async signup(email: string, password: string, firstName?: string) {
        return apiCall<{ token: string; user: any }>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, first_name: firstName }),
        });
    },

    /**
     * Récupérer mes infos
     */
    async getMe() {
        return apiCall('/auth/me');
    },

    /**
     * Déconnexion
     */
    async logout() {
        localStorage.removeItem('auth_token');
        return apiCall('/auth/logout', { method: 'POST' });
    },
};

/**
 * Tombola API - Gestion de la tombola
 */
export const tombolaApi = {
    /**
     * Récupérer mes participants
     */
    async getMyParticipants() {
        return apiCall('/tombola/participants/my');
    },

    /**
     * Créer un participant
     */
    async createParticipant(data: any) {
        return apiCall('/tombola/participants', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Récupérer tous les lots
     */
    async getLots() {
        return apiCall('/tombola/lots');
    },

    /**
     * Récupérer la liste publique des participants
     */
    async getPublicParticipants() {
        return apiCall('/tombola/participants');
    },
};

/**
 * Resend API - Email optionnel (si configuré)
 * L'API Cloudflare Workers gère Resend côté serveur pour plus de sécurité
 */
export const emailApi = {
    /**
     * Envoyer un email (via l'API Cloudflare)
     */
    async sendEmail(to: string, template: string, data: Record<string, any>) {
        return apiCall('/email/send', {
            method: 'POST',
            body: JSON.stringify({
                to,
                template,
                data,
            }),
        });
    },
};

/**
 * Utilitaire pour gérer l'authentification
 */
export const authManager = {
    /**
     * Sauvegarder le token
     */
    setToken(token: string) {
        localStorage.setItem('auth_token', token);
    },

    /**
     * Récupérer le token
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    },

    /**
     * Vérifier si connecté
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    /**
     * Supprimer le token
     */
    clearToken() {
        localStorage.removeItem('auth_token');
    },
};
