import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import 'react-native-url-polyfill/auto';
import { Database } from '~/types/database.types';
import { CreatePayload, UpdatePayload } from '~/types/types';
import imageLoader from '~/utils/imageLoader';

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

export const dbClient = createClient<Database>(dbUrl, dbAnonKey, {
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

export const getPlaces = async (userId: string) => {
  const { data, error } = await dbClient
    .from('places')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const searchPlaces = async (userId: string, query: string) => {
  const { data, error } = await dbClient
    .from('places')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPlace = async (placeId: number) => {
  const { data, error } = await dbClient.from('places').select('*').eq('id', placeId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createPlace = async (data: CreatePayload, userId: string) => {
  const { error, data: newPlace } = await dbClient
    .from('places')
    .insert({ ...data, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return newPlace;
};

export const updatePlace = async (data: UpdatePayload, id: number) => {
  const { error } = await dbClient
    .from('places')
    .update({ ...data })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deletePlace = async (id: number) => {
  const { error } = await dbClient.from('places').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const insertImage = async (path: string) => {
  const { data, error } = await dbClient.storage.from('place-images').download(path);

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    const result = await imageLoader(data);

    return result;
  }

  return null;
};

export const deleteImage = async (path: string) => {
  const { error } = await dbClient.storage.from('place-images').remove([path]);

  if (error) {
    throw new Error(error.message);
  }
};
