import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../msw/server';

process.env.EXPO_PUBLIC_DB_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_DB_API_KEY = 'test-anon-key';
process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-mapbox-token';

import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../msw/server';
import { resetSupabaseStore } from '../msw/handlers/supabase';

process.env.EXPO_PUBLIC_DB_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_DB_API_KEY = 'test-anon-key';
process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-mapbox-token';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetSupabaseStore();
});
afterAll(() => server.close());

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock('react-native-mmkv', () => ({
  createMMKV: vi.fn(() => ({
    set: vi.fn(),
    getString: vi.fn(),
    remove: vi.fn(),
  })),
}));

vi.mock('react-native-url-polyfill/auto', () => ({}));
