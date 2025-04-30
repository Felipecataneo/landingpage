'use client';
import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries
 * @param query A media query a ser testada
 * @returns Boolean indicando se a media query corresponde
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Verificar se estamos no browser
    if (typeof window === 'undefined') {
      return;
    }
    
    // Criar media query
    const media = window.matchMedia(query);
    
    // Atualizar o estado inicial
    setMatches(media.matches);
    
    // Callback para quando a media query mudar
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Adicionar listener
    media.addEventListener('change', listener);
    
    // Cleanup
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}