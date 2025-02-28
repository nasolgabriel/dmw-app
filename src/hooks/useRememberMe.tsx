import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

export function useRememberMe(
  key: string,
  defaultValue: string = "",
  encrypt: boolean = false
): [string, (newValue: string) => void, boolean, (checked: boolean) => void] {
  const [value, setValue] = useState<string>(defaultValue);
  const [remember, setRemember] = useState<boolean>(false);
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

  const encryptValue = (plainText: string) => {
    return CryptoJS.AES.encrypt(plainText, encryptionKey).toString();
  };

  const decryptValue = (cipherText: string) => {
    try {
      return CryptoJS.AES.decrypt(cipherText, encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
    } catch {
      return "";
    }
  };

  // On mount, load the stored value from localStorage.
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      const actualValue = encrypt ? decryptValue(stored) : stored;
      setValue(actualValue);
      setRemember(true);
    }
  }, [key, encrypt]);

  const updateValue = (newValue: string) => {
    setValue(newValue);
    if (remember) {
      localStorage.setItem(key, encrypt ? encryptValue(newValue) : newValue);
    }
  };

  const updateRemember = (checked: boolean) => {
    setRemember(checked);
    if (checked) {
      localStorage.setItem(key, encrypt ? encryptValue(value) : value);
    } else {
      localStorage.removeItem(key);
    }
  };

  return [value, updateValue, remember, updateRemember];
}
