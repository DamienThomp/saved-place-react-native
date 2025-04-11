import { useMemo } from 'react';

import { Place } from '~/types/types';

export default function useEditLocation(existingPlace?: Place | null): {
  editCoordinates?: string;
} {
  return useMemo(() => {
    if (!existingPlace) return { editCoordinates: undefined };

    const { longitude, latitude } = existingPlace;

    return { editCoordinates: JSON.stringify([longitude, latitude]) };
  }, [existingPlace]);
}
