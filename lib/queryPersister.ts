import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { createMMKV } from 'react-native-mmkv';

const THROTTLE_TIME = 1000;

const storage = createMMKV({ id: 'react-query' });

const clientStorage = {
  setItem: (key: string, value: string) => storage.set(key, value),
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

export const queryPersister = createAsyncStoragePersister({
  storage: clientStorage,
  throttleTime: THROTTLE_TIME,
});
