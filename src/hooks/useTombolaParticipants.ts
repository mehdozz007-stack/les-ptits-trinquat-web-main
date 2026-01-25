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
    
    try {
      setLoading(true);
      const response = await fetch(url);
      
      console.log('📊 Response status:', response.status);
      
      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
      console.error('❌ fetchParticipants error:', err.message);
      setError(err.message);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (participant: Omit<TombolaParticipant, 'id' | 'created_at'>) => {
    const url = apiUrl('/api/tombola/participants');
    console.log('📤 POST request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant),
      });
      
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
      setParticipants(prev => [data.data || data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error('❌ addParticipant error:', err.message);
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return { participants, loading, error, addParticipant, refetch: fetchParticipants };
}
