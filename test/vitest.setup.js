import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './msw/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('expo-secure-store', () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  deleteItem: vi.fn(),
}));