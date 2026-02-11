import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api-config';
import { useGlobalRefresh } from '@/context/TombolaRefreshContext';

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
  const [refetching, setRefetching] = useState(false);
  const { refreshKey, triggerRefresh } = useGlobalRefresh();

  const fetchLots = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefetching(true);

      const response = await fetch(apiUrl('/api/tombola/lots'));
      if (!response.ok) throw new Error('Failed to fetch lots');
      const data = await response.json();
      setLots(Array.isArray(data?.data || data) ? (data?.data || data) : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setLots([]);
    } finally {
      if (!silent) setLoading(false);
      else setRefetching(false);
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
      await fetchLots(true);
      triggerRefresh();
      return { data, error: null };
    } catch (err: any) {
      console.error('❌ Add lot error:', err.message);
      return { data: null, error: err.message };
    }
  };

  const reserveLot = async (lotId: string, reserverId: string) => {
    try {
      // Optimistic update
      setLots(prev =>
        prev.map(lot =>
          lot.id === lotId ? { ...lot, statut: 'reserve', reserved_by: reserverId } : lot
        )
      );

      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/reserve`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserver_id: reserverId }),
      });
      if (!response.ok) throw new Error('Failed to reserve lot');

      await fetchLots(true);
      triggerRefresh();
      return { error: null };
    } catch (err: any) {
      // Revert optimistic update on error
      await fetchLots(true);
      return { error: err.message };
    }
  };

  const cancelReservation = async (lotId: string) => {
    try {
      // Optimistic update
      setLots(prev =>
        prev.map(lot =>
          lot.id === lotId ? { ...lot, statut: 'disponible', reserved_by: null } : lot
        )
      );

      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/cancel-reservation`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel reservation');

      await fetchLots(true);
      triggerRefresh();
      return { error: null };
    } catch (err: any) {
      // Revert optimistic update on error
      await fetchLots(true);
      return { error: err.message };
    }
  };

  const markAsRemis = async (lotId: string) => {
    try {
      // Optimistic update
      setLots(prev =>
        prev.map(lot =>
          lot.id === lotId ? { ...lot, statut: 'remis' } : lot
        )
      );

      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}/mark-remis`), {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as remis');

      await fetchLots(true);
      triggerRefresh();
      return { error: null };
    } catch (err: any) {
      // Revert optimistic update on error
      await fetchLots(true);
      return { error: err.message };
    }
  };

  const getContactLink = async (lotId: string, senderName: string): Promise<string | null> => {
    try {
      const encodedName = encodeURIComponent(senderName);
      const response = await fetch(apiUrl(`/api/tombola/contact-link/${lotId}?sender_name=${encodedName}`), {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to get contact link');
      const data = await response.json();
      return data?.data?.mailto_link || null;
    } catch (err: any) {
      console.error('Error getting contact link:', err);
      return null;
    }
  };

  const deleteLot = async (lotId: string, parentId: string) => {
    try {
      // Optimistic update
      setLots(prev => prev.filter(lot => lot.id !== lotId));

      const response = await fetch(apiUrl(`/api/tombola/lots/${lotId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: parentId }),
      });
      if (!response.ok) throw new Error('Failed to delete lot');

      await fetchLots(true);
      triggerRefresh();
      return { error: null };
    } catch (err: any) {
      // Revert optimistic update on error
      await fetchLots(true);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchLots();
    // Refetch when global refresh is triggered
  }, [refreshKey]);

  return { lots, loading, refetching, error, addLot, reserveLot, cancelReservation, markAsRemis, getContactLink, deleteLot, refetch: fetchLots };
}
