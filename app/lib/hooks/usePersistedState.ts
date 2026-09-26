import { useEffect, useState } from 'react';

/**
 * Shallow shape check against `initial` -- catches the failure modes that
 * actually matter for a value read back from localStorage (null/undefined,
 * an array where an object was expected or vice versa, a primitive of the
 * wrong type), without a full schema validator. localStorage isn't network
 * input, but it can still hold a stale shape from a previous app version, a
 * manual devtools edit, or another tab -- worth guarding since a mismatch
 * here would otherwise crash the component that calls e.g. `.map` on it.
 */
function isCompatibleShape(value: unknown, initial: unknown): boolean {
  if (Array.isArray(initial)) {
    return Array.isArray(value);
  }

  if (initial !== null && typeof initial === 'object') {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  return typeof value === typeof initial;
}

function readPersisted<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return initial;
    }

    const parsed = JSON.parse(raw);

    return isCompatibleShape(parsed, initial) ? (parsed as T) : initial;
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
