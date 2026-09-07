import '~/test/utils/mockAuth';
import { waitFor } from '@testing-library/react-native';

import { useSignIn, useSignOut } from '~/api/auth';
import { renderHookWithClient } from '~/test/utils/renderHookWithClient';

const { removeClient } = vi.hoisted(() => ({
  removeClient: vi.fn(),
}));

vi.mock('~/lib/queryPersister', () => ({
  queryPersister: {
    removeClient,
  },
}));

describe('api/auth', () => {
  beforeEach(() => {
    removeClient.mockClear();
  });

  describe('useSignIn', () => {
    it('invalidates places queries on success', async () => {
      const { result, queryClient } = await renderHookWithClient(() => useSignIn());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({ email: 'test@example.com', password: 'password' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['places'] });
    });

    it('does not invalidate places queries on failure', async () => {
      const { result, queryClient } = await renderHookWithClient(() => useSignIn());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({ email: 'bad@example.com', password: 'wrong' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(invalidateSpy).not.toHaveBeenCalled();
    });
  });

  describe('useSignOut', () => {
    it('clears query client and removes persisted client', async () => {
      const { result, queryClient } = await renderHookWithClient(() => useSignOut());
      const clearSpy = vi.spyOn(queryClient, 'clear');

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(clearSpy).toHaveBeenCalled();
      expect(removeClient).toHaveBeenCalled();
    });
  });
});
