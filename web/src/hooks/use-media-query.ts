/**
 * Smart Tourist Safety System - Media Query Hook
 * Client-side media query hook for responsive design
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook for using media queries in React components
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Return false on server-side
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook for multiple media queries
 * @param queries - Object with key-value pairs of media queries
 * @returns Object with boolean values for each query
 */
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): Record<keyof T, boolean> {
  const [matches, setMatches] = useState<Record<keyof T, boolean>>(() => {
    const initialMatches = {} as Record<keyof T, boolean>;
    Object.keys(queries).forEach((key) => {
      initialMatches[key as keyof T] = false;
    });
    return initialMatches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueries = Object.entries(queries).map(([key, query]) => ({
      key: key as keyof T,
      mediaQuery: window.matchMedia(query as string),
    }));

    // Set initial values
    const initialMatches = {} as Record<keyof T, boolean>;
    mediaQueries.forEach(({ key, mediaQuery }) => {
      initialMatches[key] = mediaQuery.matches;
    });
    setMatches(initialMatches);

    // Create listeners
    const listeners = mediaQueries.map(({ key, mediaQuery }) => {
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches((prev) => ({
          ...prev,
          [key]: event.matches,
        }));
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }

      return { mediaQuery, handleChange };
    });

    // Cleanup
    return () => {
      listeners.forEach(({ mediaQuery, handleChange }) => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      });
    };
  }, [queries]);

  return matches;
}

export default useMediaQuery;