import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useSignUp } from '~/api/auth';

export function useSignUpViewModel() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();

  const signUpUser = (email: string, password: string) => {
    signUp(
      { email, password },
      {
        onError: (error) => {
          Alert.alert('Error in Sign Up', error.message);
        },
      }
    );
  };

  const goToSignIn = () => {
    router.back();
  };

  return {
    status: { isPending },
    actions: {
      signUpUser,
      goToSignIn,
    },
  };
}
