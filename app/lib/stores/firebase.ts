import { atom } from 'nanostores';
import type { FirebaseConfig } from '~/types/firebase';

export interface FirebaseConnectionState {
  config: FirebaseConfig | null;
  isConnected: boolean;
}

const STORAGE_KEY = 'firebase_connection';

const initialState: FirebaseConnectionState = {
  config: null,
  isConnected: false,
};

export const firebaseConnection = atom<FirebaseConnectionState>(initialState);

export function updateFirebaseConnection(updates: Partial<FirebaseConnectionState>) {
  const newState = { ...firebaseConnection.get(), ...updates };
  firebaseConnection.set(newState);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Failed to persist Firebase connection:', error);
  }
}

export function initializeFirebaseConnection() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      firebaseConnection.set(JSON.parse(saved) as FirebaseConnectionState);
    }
  } catch (error) {
    console.error('Failed to load saved Firebase connection:', error);
  }
}

const REQUIRED_KEYS = ['apiKey', 'projectId', 'appId'] as const;
const OPTIONAL_KEYS = ['authDomain', 'storageBucket', 'messagingSenderId'] as const;

/**
 * Firebase's console gives you a `const firebaseConfig = {...}` JS object
 * literal (unquoted keys), not strict JSON — extract fields by regex rather
 * than JSON.parse/eval so both that snippet and a plain JSON object work.
 */
export function parseFirebaseConfig(input: string): FirebaseConfig | null {
  const extract = (key: string): string | undefined => {
    const match = input.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
    return match?.[1];
  };

  const config: Partial<FirebaseConfig> = {};

  for (const key of REQUIRED_KEYS) {
    const value = extract(key);

    if (!value) {
      return null;
    }

    config[key] = value;
  }

  for (const key of OPTIONAL_KEYS) {
    const value = extract(key);

    if (value) {
      config[key] = value;
    }
  }

  return config as FirebaseConfig;
}
