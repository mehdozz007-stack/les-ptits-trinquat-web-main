import { useEffect } from 'react';
import { apiUrl } from '@/lib/api-config';

/**
 * Hook to initialize the database on first load
 * Calls the /init-db endpoint to create tables if they don't exist
 */
export function useInitializeDatabase() {
  useEffect(() => {
    const initDB = async () => {
      try {
        const response = await fetch(apiUrl('/init-db'));
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Database initialized:', data);
        }
      } catch (error) {
        console.log('ℹ️ Database initialization (may already be initialized):', error);
      }
    };

    // Only initialize once on mount
    initDB();
  }, []);
}
