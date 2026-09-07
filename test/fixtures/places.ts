import { Place } from '~/types/types';

export const TEST_USER_ID = 'test-user-id';

export const mockPlace: Place = {
  id: 1,
  title: 'Test Cafe',
  address: '123 Main St',
  image: 'place-images/test.jpg',
  latitude: 40.7128,
  longitude: -74.006,
  user_id: TEST_USER_ID,
  created_at: '2024-01-01T00:00:00.000Z',
};

export const mockPlace2: Place = {
  id: 2,
  title: 'Test Park',
  address: '456 Oak Ave',
  image: 'place-images/test2.jpg',
  latitude: 40.758,
  longitude: -73.9855,
  user_id: TEST_USER_ID,
  created_at: '2024-01-02T00:00:00.000Z',
};

export const mockPlaces: Place[] = [mockPlace, mockPlace2];
