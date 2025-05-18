'use client';

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Create state to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize on the client side
  useEffect(() => {
    try {
      // Get from local storage
      const item = window.localStorage.getItem(key);
      // Parse stored json if it exists, otherwise use initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Specific hook for navigation visibility
export function useNavVisible(): [boolean, (value: boolean | ((val: boolean) => boolean)) => void] {
  return useLocalStorage<boolean>('nav-visible', true);
}

export default useLocalStorage; 