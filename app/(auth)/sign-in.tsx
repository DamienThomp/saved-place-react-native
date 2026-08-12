import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useSignIn } from '~/api/auth';
import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';

export default function SignInScreen() {
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();

  const onSignIn = (email: string, password: string) => {
    signIn(
      { email, password },
      {
        onError: (error) => {
          Alert.alert('Error in Sign In', error.message);
        },
      }
    );
  };

  const redirectToSignUp = () => {
    router.push('./sign-up');
  };

  if (isPending) {
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
