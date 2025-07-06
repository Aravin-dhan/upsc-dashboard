import { useState, useEffect } from 'react';

/**
 * Hook to ensure component only renders on client side
 * Prevents hydration mismatches and loading loops
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook for safe localStorage access with loading state
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          setValue(JSON.parse(saved));
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
      }
      setIsLoaded(true);
    }
  }, [key]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    }
  };

  return [value, setStoredValue, isLoaded] as const;
}
