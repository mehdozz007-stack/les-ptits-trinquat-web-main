import { useEffect } from 'react';

/**
 * Hook to initialize the database on first load
 * Database is already initialized in production, so this hook is a no-op
 */
export function useInitializeDatabase() {
  useEffect(() => {
    // Database is already initialized in production
    // No action needed
  }, []);
}
