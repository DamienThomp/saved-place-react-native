import { useMemo } from 'react';

import { PlaceForm } from '~/types/placeForm';
import isEmptyString from '~/utils/isEmptyString';

export default function usePlaceFormValidation(formData: PlaceForm) {
  return useMemo(() => {
    const { title, latitude, imageUri } = formData;

    const isValid = !isEmptyString(title) && !isEmptyString(imageUri) && !!latitude;

    return { isValid };
  }, [formData.title, formData.latitude, formData.imageUri]);
}
