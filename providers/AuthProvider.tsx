import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { dbClient, getProfile, getSession, Session } from '~/lib/db';
import { Profile } from '~/lib/types';

type AuthData = {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.group === 'ADMIN';

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

      if (session) {
        const data = await getProfile(session.user.id);
        setProfile(data || null);
      }

      setLoading(false);
    };

    fetchSession();

    dbClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, profile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthContext);
