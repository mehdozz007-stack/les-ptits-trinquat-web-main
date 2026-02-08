import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api-config';

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

  const fetchParticipants = async () => {
    const url = apiUrl('/api/tombola/participants');
    console.log('📥 GET request to:', url);
    console.log('📍 Current origin:', window.location.origin);

    try {
      setLoading(true);

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
      return new Promise(resolve => setTimeout(resolve, 100)); // Attendre que React mette à jour
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
      return new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (participant: Omit<TombolaParticipant, 'id' | 'created_at'> & { classes?: string | null }) => {
    const url = apiUrl('/api/tombola/participants');
    console.log('📤 POST request to:', url);
    console.log('📋 Payload:', participant);

    try {
      // Add a timeout to the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      await fetchParticipants();
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

  const deleteParticipant = async (id: string) => {
    const url = apiUrl(`/api/tombola/participants/${id}`);
    console.log('🗑️ DELETE request to:', url);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

      console.log('✅ Participant deleted:', data);
      await fetchParticipants();
      return { success: true, error: null };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout after 10 seconds');
        return { success: false, error: 'Timeout: L\'API ne répond pas.' };
      }
      console.error('❌ deleteParticipant error:', err.message);
      const errorMsg = err.message.includes('fetch')
        ? 'Impossible de contacter le serveur. Vérifiez votre connexion Internet.'
        : err.message;
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return { participants, loading, error, addParticipant, deleteParticipant, refetch: fetchParticipants };
}
