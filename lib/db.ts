import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

export { Session } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const dbUrl = process.env.EXPO_PUBLIC_DB_URL ?? '';
const dbAnonKey = process.env.EXPO_PUBLIC_DB_API_KEY ?? '';

export const dbClient = createClient(dbUrl, dbAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getSession = async () => {
  return dbClient.auth.getSession();
};

export const getProfile = async (id: string) => {
  const { data } = await dbClient.from('profiles').select('*').eq('id', id).single();

  return data;
};

export const signOut = async () => {
  return dbClient.auth.signOut();
};
