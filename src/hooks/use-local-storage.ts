import { useState } from 'react';

export function useLocalStorage(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  // Lazy initialization: функция выполнится только при первом рендере компонента
  const [storedValue, setStoredValue] = useState<string>(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  function setValue(value: string): void {
    localStorage.setItem(key, value);
    setStoredValue(value);
  }

  return [storedValue, setValue];
}
