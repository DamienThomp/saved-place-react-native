import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn, signOut, signUp } from '~/lib/db';
import { queryPersister } from '~/lib/queryPersister';

type Credentials = {
  email: string;
  password: string;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ email, password }: Credentials) {
      return await signIn(email, password);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    async mutationFn({ email, password }: Credentials) {
      return await signUp(email, password);
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn() {
      await signOut();
    },
    async onSuccess() {
      await queryClient.clear();
      await queryPersister.removeClient();
    },
  });
};
