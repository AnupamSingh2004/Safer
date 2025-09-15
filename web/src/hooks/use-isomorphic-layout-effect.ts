/**
 * Smart Tourist Safety System - Isomorphic Layout Effect Hook
 * Safe useLayoutEffect that works on both client and server
 */

import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect on the client, useEffect on the server
 * Prevents hydration mismatches while maintaining layout effect timing on client
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;