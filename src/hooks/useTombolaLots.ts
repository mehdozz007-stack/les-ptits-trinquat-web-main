import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api-config';

export interface TombolaLot {
  id: string;
  nom: string;
  description: string | null;
  icone: string;
  statut: string;
  parent_id: string;
  reserved_by: string | null;
  created_at: string;
  parent?: {
    id: string;
    prenom: string;
    emoji: string;
  };
  reserver?: {
    id: string;
    prenom: string;
    emoji: string;
  };
}

export function useTombolaLots() {
  const [lots, setLots] = useState<TombolaLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLots = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/tombola/lots'));
      if (!response.ok) throw new Error('Failed to fetch lots');
      const data = await response.json();
      setLots(Array.isArray(data?.data || data) ? (data?.data || data) : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setLots([]);
    } finally {
      setLoading(false);
    }
  };

  const addLot = async (lot: { nom: string; description?: string; icone: string; parent_id: string }) => {
    try {
      console.log('📤 Adding lot:', lot);
      const response = await fetch(apiUrl('/api/tombola/lots'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lot),
      });
      console.log('📥 Add lot response status:', response.status);
      const data = await response.json();
      console.log('📥 Add lot response data:', data);
      if (!response.ok) {
        console.error('❌ Add lot failed:', data);
        throw new Error(data?.error || 'Failed to add lot');
      }
      await fetchLots();
      return { data, error: null };
    } catch (err: any) {
      console.error('❌ Add lot error:', err.message);
      return { data: null, error: err.message };
    }
  };

  const reserveLot = async (lotId: string, reserverId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/reserve`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserverId }),
      });
      if (!response.ok) throw new Error('Failed to reserve lot');
      await fetchLots();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const cancelReservation = async (lotId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/cancel-reservation`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel reservation');
      await fetchLots();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const markAsRemis = async (lotId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/mark-remis`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as remis');
      await fetchLots();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const getContactLink = async (lotId: string, senderName: string): Promise<string | null> => {
    try {
      const response = await fetch(apiUrl('/api/tombola/contact-link'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId, senderName }),
      });
      if (!response.ok) throw new Error('Failed to get contact link');
      const data = await response.json();
      return data?.mailtoLink || null;
    } catch (err: any) {
      console.error('Error getting contact link:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  return { lots, loading, error, addLot, reserveLot, cancelReservation, markAsRemis, getContactLink, refetch: fetchLots };
}
