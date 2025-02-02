import { Redirect } from 'expo-router';

import Loading from '~/components/Loading';
import { useAuthentication } from '~/providers/AuthProvider';

export default function Home() {
  const { session, loading } = useAuthentication();

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(main)/Index" />;
}
