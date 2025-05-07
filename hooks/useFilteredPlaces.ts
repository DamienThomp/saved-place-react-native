import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { usePlacesList, useSearchPlace } from '~/api/places';
import { Place } from '~/types/types';

// TODO: - Refactor to include paginated results
export default function useFilteredPlaces(query: string) {
  const [filteredList, setFilteredList] = useState<Place[] | null>(null);

  const { data, error, isLoading, refetch } = usePlacesList();
  const { data: searchResults, error: searchError } = useSearchPlace(query);

  useEffect(() => {
    if (searchResults) {
      setFilteredList(searchResults);
      return;
    }

    if (data) {
      setFilteredList(data);
    }
  }, [data, searchResults]);

  useEffect(() => {
    if (searchError) {
      Alert.alert('Something Went Wrong!', searchError.message);
    }
  }, [searchError]);

  return { filteredList, error, isLoading, refetch };
}
