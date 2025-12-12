import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook qui scroll au top de la page à chaque changement de route
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll au top de la page
    window.scrollTo(0, 0);
  }, [pathname]);
};
