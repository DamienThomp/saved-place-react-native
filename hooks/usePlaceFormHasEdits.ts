import { useMemo } from 'react';

import { PlaceForm } from '~/app/(main)/form';

export default function usePlaceFormHasEdits(
  placeFormData: PlaceForm,
  originalPlace?: PlaceForm,
  isEditing?: boolean,
  isValid?: boolean
): { hasEdits: boolean } {
  return useMemo(() => {
    if (!isEditing) {
      return { hasEdits: !!isValid };
    }

    if (!originalPlace) {
      return { hasEdits: false };
    }

    const fieldsToCompare: (keyof PlaceForm)[] = [
      'title',
      'address',
      'imageUri',
      'latitude',
      'longitude',
    ];

    const changedFields: string[] = [];

    for (const field of fieldsToCompare) {
      if (placeFormData[field] !== originalPlace[field]) {
        changedFields.push(field);
      }
    }

    return { hasEdits: changedFields.length > 0 };
  }, [originalPlace, placeFormData, isEditing, isValid]);
}
