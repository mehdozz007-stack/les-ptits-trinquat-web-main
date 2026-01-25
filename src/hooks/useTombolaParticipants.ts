import { useState, useEffect } from 'react';

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
    try {
      setLoading(true);
      const response = await fetch('/api/tombola/participants');
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      setParticipants(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (participant: Omit<TombolaParticipant, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/tombola/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant),
      });
      if (!response.ok) throw new Error('Failed to add participant');
      const data = await response.json();
      setParticipants(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return { participants, loading, error, addParticipant, refetch: fetchParticipants };
}
