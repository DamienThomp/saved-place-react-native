import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import { dbClient } from '~/lib/db';

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const onSignUp = async (email: string, password: string) => {
    setIsLoading(true);

    const { error } = await dbClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error in Sign Up', `${error.message}`);
    }

    setIsLoading(false);
  };

  const redirectToSignIn = () => {
    router.back();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <AuthForm
        actionLabel="Sign Up"
        secondaryLabel="Sign In"
        primaryAction={onSignUp}
        secondaryAction={redirectToSignIn}
      />
    </Container>
  );
}
