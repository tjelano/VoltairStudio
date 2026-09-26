import { useEffect, useState } from 'react';

function readPersisted<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  } catch {
    return initial;
  }
}

/**
 * Like useState, but the value survives reload/navigation via localStorage.
 * Only safe to call from client-only components (no SSR guard) -- callers
 * of this hook are all rendered inside .client.tsx boundaries.
 */
export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => readPersisted(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage can be unavailable (private browsing, quota) -- not fatal, just don't persist
    }
  }, [key, state]);

  return [state, setState] as const;
}
