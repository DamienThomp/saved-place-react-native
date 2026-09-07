import { Session } from '~/lib/db';

import { mockSession } from '../fixtures/session';

type AuthMock = {
  session: Session | null;
  loading: boolean;
};

let authState: AuthMock = {
  session: mockSession,
  loading: false,
};

export function setMockAuth(session: Session | null, loading = false) {
  authState = { session, loading };
}

export function resetMockAuth() {
  authState = { session: mockSession, loading: false };
}

vi.mock('~/providers/AuthProvider', () => ({
  useAuthentication: () => authState,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
