import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook qui scroll au top de la page à chaque changement de route
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Utiliser requestAnimationFrame pour s'assurer que le scroll se fait après le rendu
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Utilisez 'auto' pour un scroll instantané, pas 'smooth'
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);
};
