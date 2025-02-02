import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { dbClient, getSession, Session } from '~/lib/db';

type AuthData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await getSession();

      if (error) {
        // do something with error
        return;
      }

      setSession(session);

      setLoading(false);
    };

    fetchSession();

    dbClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}

export const useAuthentication = () => useContext(AuthContext);
