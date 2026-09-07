import '~/test/utils/mockAuth';
import { waitFor } from '@testing-library/react-native';

import {
  useDeletePlace,
  useInsertPlace,
  usePlaceDetails,
  usePlacesList,
  useSearchPlace,
} from '~/api/places';
import { server } from '~/msw/server';
import { mockPlace } from '~/test/fixtures/places';
import { resetMockAuth, setMockAuth } from '~/test/utils/mockAuth';
import { renderHookWithClient } from '~/test/utils/renderHookWithClient';
import { supabasePlacesDeleteError, supabasePlacesPostError } from '~/test/utils/mswErrors';

describe('api/places', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  describe('usePlacesList', () => {
    it('is disabled when there is no session', async () => {
      setMockAuth(null);

      const { result } = await renderHookWithClient(() => usePlacesList());

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('usePlaceDetails', () => {
    it('is disabled when id is not provided', async () => {
      const { result } = await renderHookWithClient(() => usePlaceDetails(undefined));

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useInsertPlace', () => {
    it('invalidates places queries on success', async () => {
      const { result, queryClient } = await renderHookWithClient(() => useInsertPlace());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        title: 'Inserted Place',
        address: '111 Test Ln',
        latitude: 40.1,
        longitude: -74.1,
        image: 'place-images/insert.jpg',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['places'] });
    });

    it('does not invalidate places queries on error', async () => {
      server.use(supabasePlacesPostError());

      const { result, queryClient } = await renderHookWithClient(() => useInsertPlace());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        title: 'Inserted Place',
        address: '111 Test Ln',
        latitude: 40.1,
        longitude: -74.1,
        image: 'place-images/insert.jpg',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(invalidateSpy).not.toHaveBeenCalled();
    });
  });

  describe('useDeletePlace', () => {
    it('invalidates places queries on success', async () => {
      const { result, queryClient } = await renderHookWithClient(() => useDeletePlace());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(mockPlace.id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['places'] });
    });

    it('invalidates places queries on error', async () => {
      server.use(supabasePlacesDeleteError());

      const { result, queryClient } = await renderHookWithClient(() => useDeletePlace());
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(mockPlace.id);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['places'] });
    });
  });

  describe('useSearchPlace', () => {
    it('is disabled when query is empty', async () => {
      const { result } = await renderHookWithClient(() => useSearchPlace(''));

      expect(result.current.fetchStatus).toBe('idle');
    });
  });
});
