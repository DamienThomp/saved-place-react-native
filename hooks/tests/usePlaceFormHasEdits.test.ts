import { renderHook } from '@testing-library/react-native';

import usePlaceFormHasEdits from '~/hooks/usePlaceFormHasEdits';
import { PlaceForm } from '~/types/placeForm';

const validForm: PlaceForm = {
  title: 'Test',
  address: '123 Main',
  imageUri: 'file:///image.jpg',
  latitude: 40.0,
  longitude: -74.0,
};

describe('usePlaceFormHasEdits', () => {
  it('returns hasEdits true in create mode when valid', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormHasEdits(validForm, undefined, false, true)
    );

    expect(result.current.hasEdits).toBe(true);
  });

  it('returns hasEdits false in create mode when invalid', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormHasEdits(validForm, undefined, false, false)
    );

    expect(result.current.hasEdits).toBe(false);
  });

  it('returns false in edit mode when original data is missing', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormHasEdits(validForm, undefined, true, true)
    );

    expect(result.current.hasEdits).toBe(false);
  });

  it('returns false in edit mode when nothing changed', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormHasEdits(validForm, validForm, true, true)
    );

    expect(result.current.hasEdits).toBe(false);
  });

  it('detects field changes in edit mode', async () => {
    const { result } = await renderHook(() =>
      usePlaceFormHasEdits({ ...validForm, title: 'Updated' }, validForm, true, true)
    );

    expect(result.current.hasEdits).toBe(true);
  });
});
