import { useCallback } from "react";

export const useLocalStorage = <T>(key: string, value: T) => {
  const loadFromStorage = useCallback((): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }, [key]);

  const removeFromStorage = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return { loadFromStorage, removeFromStorage, saveToStorage };
};
