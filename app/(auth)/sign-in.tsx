import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import { dbClient } from '~/lib/db';

export default function SignInScreen() {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const onSignIn = async (email: string, password: string) => {
    setIsLoading(true);

    const { error } = await dbClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error in Sign Up', `${error.message}`);
    }

    setIsLoading(false);
  };

  const redirectToSignUp = () => {
    router.push('./sign-up');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <AuthForm
        actionLabel="Sign In"
        secondaryLabel="Create Account"
        primaryAction={onSignIn}
        secondaryAction={redirectToSignUp}
      />
    </Container>
  );
}
