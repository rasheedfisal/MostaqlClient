"use client";

import {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  if (typeof window !== "undefined") {
    return useStorage(key, defaultValue, window?.localStorage);
  } else {
    return useStorage(key, defaultValue, null);
  }
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
  if (typeof window !== "undefined") {
    return useStorage(key, defaultValue, window?.sessionStorage);
  } else {
    return useStorage(key, defaultValue, null);
  }
}

const useStorage = <T>(
  key: string,
  defaultValue: T,
  storageObject: Storage | null
): [value: T, setValue: Dispatch<SetStateAction<T>>, remove?: () => void] => {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject?.getItem(key);
    if (jsonValue != null) {
      // console.log(jsonValue);
      return JSON.parse(jsonValue);
    }

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject?.removeItem(key);
    storageObject?.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(value);
  }, []);

  return [value, setValue, remove];
};
