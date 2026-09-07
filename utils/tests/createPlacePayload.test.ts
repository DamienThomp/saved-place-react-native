import { PlaceForm } from '~/types/placeForm';
import { createPlacePayload } from '~/utils/createPlacePayload';

import { mockPlace } from '../../test/fixtures/places';

const formData: PlaceForm = {
  title: 'New Place',
  address: '789 Pine Rd',
  imageUri: 'file:///tmp/image.jpg',
  latitude: 41.0,
  longitude: -75.0,
};

describe('createPlacePayload', () => {
  it('returns create payload without id when not editing', () => {
    const payload = createPlacePayload(formData, 'place-images/new.jpg');

    expect(payload).toEqual({
      title: 'New Place',
      address: '789 Pine Rd',
      latitude: 41.0,
      longitude: -75.0,
      image: 'place-images/new.jpg',
    });
    expect('id' in payload).toBe(false);
  });

  it('returns update payload with id when editing', () => {
    const payload = createPlacePayload(formData, 'place-images/new.jpg', mockPlace);

    expect(payload).toEqual({
      title: 'New Place',
      address: '789 Pine Rd',
      latitude: 41.0,
      longitude: -75.0,
      image: 'place-images/new.jpg',
      id: mockPlace.id,
    });
  });
});
