import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

// Initialize MMKV with error handling for remote debugging
try {
  storage = new MMKV();
  console.log('MMKV initialized successfully');
} catch (error: any) {
  if (
    error.message?.includes('synchronous method invocations') ||
    error.message?.includes('not running on-device')
  ) {
    console.warn(
      'Remote debugging detected - MMKV disabled, using in-memory fallback',
    );
  } else {
    console.warn('MMKV initialization failed:', error);
  }
}

// Fallback to in-memory storage when MMKV is not available (remote debugging)
const fallbackStorage: { [key: string]: string } = {};

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    if (storage) {
      storage.set(key, value);
    } else {
      fallbackStorage[key] = value;
    }
  },
  getItem: (key: string) => {
    if (storage) {
      const value = storage.getString(key);
      return value ?? null;
    } else {
      return fallbackStorage[key] ?? null;
    }
  },
  removeItem: (key: string) => {
    if (storage) {
      storage.delete(key);
    } else {
      delete fallbackStorage[key];
    }
  },
  clear: () => {
    if (storage) {
      storage.clearAll();
    } else {
      Object.keys(fallbackStorage).forEach(key => delete fallbackStorage[key]);
    }
  },
};
