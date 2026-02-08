/**
 * TombolaAPI - Frontend API Client for Tombola Feature
 * Handles all communication with Cloudflare Workers D1 backend
 */

import { Parent, Lot } from '@/lib/types';
import { apiUrl } from '@/lib/api-config';

interface AuthToken {
    parentId: string;
    email: string;
}

const API_BASE = '/api/tombola';

/**
 * Utility to resolve API URLs with proper base
 */
function resolveApiUrl(endpoint: string): string {
    return apiUrl(`${API_BASE}${endpoint}`);
}

/**
 * Utility to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || data;
}

/**
 * TombolaAPI - Static methods for Tombola operations
 */
export const TombolaAPI = {
    /**
     * Get all parents (participants)
     */
    async getParents(): Promise<Parent[]> {
        const response = await fetch(resolveApiUrl('/participants'));
        const data = await handleResponse<any[]>(response);

        // Map API response to Parent interface
        return (Array.isArray(data) ? data : (data.data || [])).map((p: any) => ({
            id: p.id,
            first_name: p.prenom,
            email: p.email || '',
            emoji: p.emoji || '😊',
            classes: p.classes,
            created_at: p.created_at,
        }));
    },

    /**
     * Get all lots
     */
    async getLots(): Promise<Lot[]> {
        const response = await fetch(resolveApiUrl('/lots'));
        const data = await handleResponse<any[]>(response);

        // Map API response to Lot interface
        return (Array.isArray(data) ? data : (data.data || [])).map((l: any) => ({
            id: l.id,
            parent_id: l.parent_id,
            title: l.nom,
            description: l.description,
            status: this.mapStatus(l.statut),
            reserved_by: l.reserved_by,
            created_at: l.created_at,
        }));
    },

    /**
     * Create a new parent (participant)
     */
    async createParent(parent: {
        first_name: string;
        email: string;
        emoji: string;
        classes?: string;
    }): Promise<Parent> {
        const response = await fetch(`${API_BASE}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prenom: parent.first_name,
                email: parent.email,
                emoji: parent.emoji,
                classes: parent.classes,
                role: 'Parent',
            }),
        });

        const data = await handleResponse<{ success: boolean; data: { id: string } }>(response);

        // Return the created parent
        return {
            id: data.data.id,
            first_name: parent.first_name,
            email: parent.email,
            emoji: parent.emoji,
            classes: parent.classes,
        };
    },

    /**
     * Create a new lot
     */
    async createLot(lot: {
        title: string;
        description?: string;
    }): Promise<Lot> {
        const auth = this.getAuth();
        if (!auth) {
            throw new Error('Parent not authenticated');
        }

        const response = await fetch(`${API_BASE}/lots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: lot.title,
                description: lot.description,
                parent_id: auth.parentId,
                icone: '🎁',
            }),
        });

        const data = await handleResponse<{ success: boolean; data: { id: string } }>(response);

        // Return the created lot
        return {
            id: data.data.id,
            parent_id: auth.parentId,
            title: lot.title,
            description: lot.description,
            status: 'available',
        };
    },

    /**
     * Reserve a lot
     */
    async reserveLot(lotId: string): Promise<Lot> {
        const auth = this.getAuth();
        if (!auth) {
            throw new Error('Parent not authenticated');
        }

        const response = await fetch(`${API_BASE}/lots/${lotId}/reserve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reserver_id: auth.parentId,
            }),
        });

        // Fetch updated lot
        await handleResponse<{ success: boolean }>(response);
        const allLots = await this.getLots();
        const updatedLot = allLots.find(l => l.id === lotId);

        if (!updatedLot) {
            throw new Error('Lot not found');
        }

        return updatedLot;
    },

    /**
     * Delete a lot
     */
    async deleteLot(lotId: string): Promise<void> {
        const auth = this.getAuth();
        if (!auth) {
            throw new Error('Parent not authenticated');
        }

        const response = await fetch(`${API_BASE}/lots/${lotId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        await handleResponse<{ success: boolean }>(response);
    },

    /**
     * Delete a parent (participant)
     */
    async deleteParent(parentId: string): Promise<void> {
        const auth = this.getAuth();
        if (!auth) {
            throw new Error('Parent not authenticated');
        }

        const response = await fetch(`${API_BASE}/admin/participants/${parentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        await handleResponse<{ success: boolean }>(response);
    },

    /**
     * Store auth token in localStorage
     */
    setAuth(auth: AuthToken | null): void {
        if (auth) {
            localStorage.setItem('tombola_auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('tombola_auth');
        }
    },

    /**
     * Get auth token from localStorage
     */
    getAuth(): AuthToken | null {
        const stored = localStorage.getItem('tombola_auth');
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    },

    /**
     * Map database status to component status
     */
    mapStatus(dbStatus: string): 'available' | 'reserved' | 'delivered' {
        const statusMap: Record<string, 'available' | 'reserved' | 'delivered'> = {
            'disponible': 'available',
            'réservé': 'reserved',
            'remis': 'delivered',
        };
        return statusMap[dbStatus] || 'available';
    },

    /**
     * ADMIN OPERATIONS
     */

    /**
     * Login as admin (would need proper auth backend)
     */
    async adminLogin(email: string, password: string): Promise<{ token: string }> {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid admin credentials');
        }

        const data = await response.json();
        return data.data;
    },

    /**
     * Get admin parents with emails (admin only)
     */
    async getAdminParents(): Promise<Parent[]> {
        const token = localStorage.getItem('admin_token');

        console.log('📥 getAdminParents called, token exists:', !!token);

        if (!token) {
            throw new Error('Not authenticated - no token found');
        }

        try {
            const url = resolveApiUrl('/admin/participants');
            console.log('📤 Fetching from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('📥 Response status:', response.status, response.statusText);

            const data = await handleResponse<any[]>(response);

            console.log('✅ Data received:', data);

            return (Array.isArray(data) ? data : (data.data || [])).map((p: any) => ({
                id: p.id,
                first_name: p.prenom,
                email: p.email || '',
                emoji: p.emoji || '😊',
                classes: p.classes,
                created_at: p.created_at,
            }));
        } catch (error) {
            console.error('❌ Error in getAdminParents:', error);
            throw error;
        }
    },

    /**
     * Delete a participant (admin only)
     */
    async adminDeleteParticipant(participantId: string): Promise<void> {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('Not authenticated - no token found');
        }

        const url = resolveApiUrl(`/admin/participants/${participantId}`);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        await handleResponse<{ success: boolean }>(response);
    },

    /**
     * Cancel a lot reservation (admin only)
     */
    async adminCancelReservation(lotId: string): Promise<void> {
        const response = await fetch(`${API_BASE}/lots/${lotId}/cancel`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        await handleResponse<{ success: boolean }>(response);
    },

    /**
     * Mark a lot as delivered (admin only)
     */
    async adminMarkAsDelivered(lotId: string): Promise<void> {
        const response = await fetch(`${API_BASE}/lots/${lotId}/remis`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        await handleResponse<{ success: boolean }>(response);
    },

    /**
     * Delete a lot (admin only)
     */
    async adminDeleteLot(lotId: string): Promise<void> {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('Not authenticated - no token found');
        }

        const url = resolveApiUrl(`/admin/lots/${lotId}`);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        await handleResponse<{ success: boolean }>(response);
    },
};
