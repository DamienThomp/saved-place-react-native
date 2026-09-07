import { renderHook } from '@testing-library/react-native';

import usePlaceFormValidation from '~/hooks/usePlaceFormValidation';
import { PlaceForm } from '~/types/placeForm';

const validForm: PlaceForm = {
  title: 'Test',
  address: '123 Main',
  imageUri: 'file:///image.jpg',
  latitude: 40.0,
  longitude: -74.0,
};

describe('usePlaceFormValidation', () => {
  it('returns invalid when title is empty', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormValidation({ ...validForm, title: '   ' })
    );

    expect(result.current.isValid).toBe(false);
  });

  it('returns invalid when imageUri is empty', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormValidation({ ...validForm, imageUri: '' })
    );

    expect(result.current.isValid).toBe(false);
  });

  it('returns invalid when latitude is missing', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormValidation({ ...validForm, latitude: undefined })
    );

    expect(result.current.isValid).toBe(false);
  });

  it('returns valid for complete form data', async () => {
    const { result } = await renderHook(() => usePlaceFormValidation(validForm));

    expect(result.current.isValid).toBe(true);
  });
});
