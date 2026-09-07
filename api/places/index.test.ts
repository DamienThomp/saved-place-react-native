import '~/test/utils/mockAuth';
import { waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import {
  useDeletePlace,
  useInsertPlace,
  usePlaceDetails,
  usePlacesList,
  useSearchPlace,
} from '~/api/places';
import { server } from '~/msw/server';
import { mockPlace, TEST_USER_ID } from '~/test/fixtures/places';
import { resetMockAuth, setMockAuth } from '~/test/utils/mockAuth';
import { renderHookWithClient } from '~/test/utils/renderHookWithClient';

describe('api/places', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  describe('usePlacesList', () => {
    it('fetches the first page of places', async () => {
      const { result } = await renderHookWithClient(() => usePlacesList());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.pages[0].data).toHaveLength(2);
    });

    it('fetches next page when requested', async () => {
      const { result } = await renderHookWithClient(() => usePlacesList());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      result.current.fetchNextPage();

      await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false));
      expect(result.current.data?.pages.length).toBeGreaterThanOrEqual(1);
    });

    it('is disabled when there is no session', async () => {
      setMockAuth(null);

      const { result } = await renderHookWithClient(() => usePlacesList());

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('usePlaceDetails', () => {
    it('fetches place details when id is provided', async () => {
      const { result } = await renderHookWithClient(() => usePlaceDetails(mockPlace.id));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.title).toBe(mockPlace.title);
    });

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
      server.use(
        http.delete('https://test.supabase.co/rest/v1/places', () =>
          HttpResponse.json({ message: 'Delete failed' }, { status: 500 })
        )
      );

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

    it('returns search results for a query', async () => {
      const { result } = await renderHookWithClient(() => useSearchPlace('Cafe'));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].user_id).toBe(TEST_USER_ID);
    });
  });
});
