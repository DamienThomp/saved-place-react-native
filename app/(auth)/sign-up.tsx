import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useSignUp } from '~/api/auth';
import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';

export default function SignUpScreen() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();

  const onSignUp = (email: string, password: string) => {
    signUp(
      { email, password },
      {
        onError: (error) => {
          Alert.alert('Error in Sign Up', error.message);
        },
      }
    );
  };

  const redirectToSignIn = () => {
    router.back();
  };

  if (isPending) {
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
