import { server } from '~/msw/server';

import {
  createPlace,
  deletePlace,
  getAllPlaces,
  getPlace,
  getPlaces,
  insertImage,
  PLACES_PAGE_SIZE,
  searchPlaces,
  signIn,
  signUp,
  updatePlace,
} from '~/lib/db';
import { mockPlace, TEST_USER_ID } from '../test/fixtures/places';
import {
  supabasePlacesDeleteError,
  supabasePlacesGetError,
  supabasePlacesPostError,
  supabaseStorageSignError,
} from '../test/utils/mswErrors';

describe('lib/db', () => {
  describe('getPlaces', () => {
    it('returns paginated places with hasMore false when fewer than page size', async () => {
      const result = await getPlaces(TEST_USER_ID, { page: 0, pageSize: PLACES_PAGE_SIZE });

      expect(result.data).toHaveLength(2);
      expect(result.hasMore).toBe(false);
    });

    it('returns hasMore true when more pages exist', async () => {
      const result = await getPlaces(TEST_USER_ID, { page: 0, pageSize: 1 });

      expect(result.data).toHaveLength(1);
      expect(result.hasMore).toBe(true);
    });

    it('rejects when the request fails', async () => {
      server.use(supabasePlacesGetError());

      await expect(getPlaces(TEST_USER_ID)).rejects.toThrow();
    });
  });

  describe('getAllPlaces', () => {
    it('returns all places for user ordered by created_at desc', async () => {
      const result = await getAllPlaces(TEST_USER_ID);

      expect(result).toHaveLength(2);
      expect(result?.[0].id).toBe(2);
    });

    it('rejects when the request fails', async () => {
      server.use(supabasePlacesGetError());

      await expect(getAllPlaces(TEST_USER_ID)).rejects.toThrow();
    });
  });

  describe('searchPlaces', () => {
    it('filters places by title', async () => {
      const result = await searchPlaces(TEST_USER_ID, 'Cafe');

      expect(result).toHaveLength(1);
      expect(result?.[0].title).toBe('Test Cafe');
    });

    it('rejects when the request fails', async () => {
      server.use(supabasePlacesGetError());

      await expect(searchPlaces(TEST_USER_ID, 'Cafe')).rejects.toThrow();
    });
  });

  describe('getPlace', () => {
    it('returns a single place by id', async () => {
      const result = await getPlace(mockPlace.id);

      expect(result.id).toBe(mockPlace.id);
      expect(result.title).toBe(mockPlace.title);
    });

    it('throws when place is not found', async () => {
      await expect(getPlace(9999)).rejects.toThrow();
    });
  });

  describe('createPlace', () => {
    it('inserts and returns a new place', async () => {
      const payload = {
        title: 'New Spot',
        address: '999 Elm St',
        latitude: 40.0,
        longitude: -74.0,
        image: 'place-images/new.jpg',
      };

      const result = await createPlace(payload, TEST_USER_ID);

      expect(result.title).toBe('New Spot');
      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.id).toBeDefined();
    });

    it('rejects when the request fails', async () => {
      server.use(supabasePlacesPostError());

      await expect(
        createPlace(
          {
            title: 'New Spot',
            address: '999 Elm St',
            latitude: 40.0,
            longitude: -74.0,
            image: 'place-images/new.jpg',
          },
          TEST_USER_ID
        )
      ).rejects.toThrow();
    });
  });

  describe('updatePlace', () => {
    it('updates an existing place', async () => {
      await updatePlace(
        {
          id: mockPlace.id,
          title: 'Updated Cafe',
          address: mockPlace.address,
          latitude: mockPlace.latitude,
          longitude: mockPlace.longitude,
          image: mockPlace.image ?? '',
        },
        mockPlace.id
      );

      const result = await getPlace(mockPlace.id);
      expect(result.title).toBe('Updated Cafe');
    });

    it('rejects when the place is not found', async () => {
      await expect(
        updatePlace(
          {
            id: 9999,
            title: 'Missing',
            address: 'Nowhere',
            latitude: 0,
            longitude: 0,
            image: '',
          },
          9999
        )
      ).rejects.toThrow();
    });
  });

  describe('deletePlace', () => {
    it('deletes a place', async () => {
      await deletePlace(mockPlace.id);

      await expect(getPlace(mockPlace.id)).rejects.toThrow();
    });

    it('rejects when the request fails', async () => {
      server.use(supabasePlacesDeleteError());

      await expect(deletePlace(mockPlace.id)).rejects.toThrow();
    });
  });

  describe('insertImage', () => {
    it('returns a signed URL', async () => {
      const result = await insertImage('test.jpg');

      expect(result).toContain('test.jpg');
    });

    it('rejects when the request fails', async () => {
      server.use(supabaseStorageSignError());

      await expect(insertImage('test.jpg')).rejects.toThrow();
    });
  });

  describe('auth', () => {
    it('signs in successfully', async () => {
      const result = await signIn('test@example.com', 'password');

      expect(result.user.email).toBe('test@example.com');
      expect(result.session?.access_token).toBeDefined();
    });

    it('throws on invalid credentials', async () => {
      await expect(signIn('bad@example.com', 'wrong')).rejects.toThrow();
    });

    it('throws when signing up with an existing email', async () => {
      await expect(signUp('exists@example.com', 'password')).rejects.toThrow();
    });
  });
});
