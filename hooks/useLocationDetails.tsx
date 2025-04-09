import { useLocalSearchParams } from 'expo-router';

import { usePlaceDetails } from '~/api/places';
import getIdFromParam from '~/utils/getIdFromParam';

export function useLocationDetails() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const locationId = getIdFromParam(id);
  const isEditing = !!id;

  const { data, isLoading, error } = usePlaceDetails(locationId);

  return {
    data,
    isLoading,
    error,
    isEditing,
  };
}
