import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api-config';
import { useGlobalRefresh } from '@/context/TombolaRefreshContext';

// Public participant data (without email for privacy)
export interface TombolaParticipantPublic {
  id: string;
  prenom: string;
  nom: string;
  role: string;
  classes?: string[];
  emoji: string;
  created_at: string;
  lotsProposees?: string[];
  lotsReservees?: string[];
}

// Full participant data (for insertion only, email not exposed in SELECT)
export interface TombolaParticipant extends TombolaParticipantPublic {
  email: string;
}

export function useTombolaParticipants() {
  const [participants, setParticipants] = useState<TombolaParticipantPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetching, setRefetching] = useState(false);
  const { refreshKey, triggerRefresh } = useGlobalRefresh();

  const fetchParticipants = async (silent = false) => {
    const url = apiUrl('/api/tombola/participants');
    console.log('📥 GET request to:', url);
    console.log('📍 Current origin:', window.location.origin);

    try {
      if (!silent) setLoading(true);
      else setRefetching(true);

      // Add a timeout to the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Array.from(response.headers.entries()));

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Try to parse JSON
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON (Status: ${response.status})`);
      }

      console.log('✅ Participants fetched:', result);

      // Extract data from API response
      const data = result?.data || result || [];
      setParticipants(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout after 10 seconds');
        setError('Timeout: L\'API ne répond pas. Vérifiez votre connexion Internet.');
      } else {
        console.error('❌ fetchParticipants error:', err.message);
        console.error('❌ Full error:', err);
        // More helpful error message
        const errorMsg = err.message.includes('fetch')
          ? 'Impossible de contacter le serveur. Vérifiez votre connexion Internet et le domaine: ' + url
          : err.message;
        setError(errorMsg);
      }
      setParticipants([]);
    } finally {
      if (!silent) setLoading(false);
      else setRefetching(false);
    }
  };

  /**
   * Récupère les participants créés par l'utilisateur courant (filtrés par user_id)
   */
  const fetchMyParticipants = async (userId: string) => {
    const url = apiUrl(`/api/tombola/participants/my?user_id=${encodeURIComponent(userId)}`);
    console.log('📥 GET request to:', url);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON (Status: ${response.status})`);
      }

      console.log('✅ My participants fetched:', result);

      const data = result?.data || result || [];
      setParticipants(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout after 10 seconds');
        setError('Timeout lors de la récupération de vos participants');
      } else {
        console.error('❌ fetchMyParticipants error:', err.message);
        const errorMsg = err.message.includes('fetch')
          ? 'Impossible de contacter le serveur'
          : err.message;
        setError(errorMsg);
      }
      setParticipants([]);
    }
  };

  const addParticipant = async (participant: Omit<TombolaParticipant, 'id' | 'created_at'> & { classes?: string | null; user_id?: string }, token: string) => {
    const url = apiUrl('/api/tombola/participants');
    console.log('📤 POST request to:', url);
    console.log('📋 Payload:', participant);

    try {
      // Add a timeout to the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(participant),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📊 Response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON (Status: ${response.status})`);
      }

      if (!response.ok) {
        const errorMessage = data?.error || `Server error: ${response.status}`;
        console.error('❌ API error:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Participant created:', data);
      // Optimistic update
      const newParticipant = data.data || data;
      setParticipants(prev => [newParticipant, ...prev]);

      // Refetch silently to sync with server
      await fetchParticipants(true);
      triggerRefresh();

      return { data, error: null };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout after 10 seconds');
        return { data: null, error: 'Timeout: L\'API ne répond pas.' };
      }
      console.error('❌ addParticipant error:', err.message);
      const errorMsg = err.message.includes('fetch')
        ? 'Impossible de contacter le serveur. Vérifiez votre connexion Internet.'
        : err.message;
      return { data: null, error: errorMsg };
    }
  };

  const deleteParticipant = async (participantId: string, token: string) => {
    const url = apiUrl(`/api/tombola/participants/${participantId}`);
    console.log('📤 DELETE request to:', url);

    try {
      // Optimistic update
      setParticipants(prev => prev.filter(p => p.id !== participantId));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      console.log('✅ Participant deleted');

      // Refetch silently to sync with server
      await fetchParticipants(true);
      triggerRefresh();

      return { error: null };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout');
        // Revert optimistic update on timeout
        await fetchParticipants(true);
        return { error: 'Timeout: L\'API ne répond pas.' };
      }
      console.error('❌ deleteParticipant error:', err.message);
      // Revert optimistic update on error
      await fetchParticipants(true);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchParticipants();
    // Refetch when global refresh is triggered
  }, [refreshKey]);

  // Wrapper pour fetchParticipants qui peut être passée aux composants enfants
  const refetchAsync = async () => {
    await fetchParticipants(true);
  };

  return { participants, loading, refetching, error, addParticipant, deleteParticipant, fetchMyParticipants, refetch: refetchAsync, _refetchSilently: fetchParticipants };
}
