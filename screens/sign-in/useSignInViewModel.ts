import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useSignIn } from '~/api/auth';

export function useSignInViewModel() {
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();

  const signInUser = (email: string, password: string) => {
    signIn(
      { email, password },
      {
        onError: (error) => {
          Alert.alert('Error in Sign In', error.message);
        },
      }
    );
  };

  const goToSignUp = () => {
    router.push('./sign-up');
  };

  return {
    status: { isPending },
    actions: {
      signInUser,
      goToSignUp,
    },
  };
}
