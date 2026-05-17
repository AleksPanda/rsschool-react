import { useState } from 'react';

export function useLocalStorage(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  // Lazy initialization: функция выполнится только при первом рендере компонента.
  const [storedValue] = useState<string>(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  function saveValue(value: string): void {
    localStorage.setItem(key, value);
  }

  return [storedValue, saveValue];
}
