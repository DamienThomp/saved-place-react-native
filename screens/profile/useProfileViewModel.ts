import { Alert } from 'react-native';

import { useSignOut } from '~/api/auth';
import { useAuthentication } from '~/providers/AuthProvider';

export function useProfileViewModel() {
  const { session } = useAuthentication();
  const { mutate: signOut, isPending } = useSignOut();

  const handleSignOut = () => {
    signOut(undefined, {
      onError: (error) => {
        Alert.alert('Sign Out Error', `Unable to sign you out: ${error.message}`);
      },
    });
  };

  return {
    status: { isPending, shouldRedirect: !session },
    state: { session },
    actions: {
      handleSignOut,
    },
  };
}
