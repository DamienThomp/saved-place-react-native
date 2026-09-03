import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { SearchBarCommands } from 'react-native-screens';

import { SelectedPoint } from '~/components/map/Map';
import { useMapSearch } from '~/providers/MapSearchProvider';
import useMapSelectionStore from '~/stores/mapSelectionStore';

export function useMapModalViewModel() {
  const { setSearchQuery, searchResults, coordinates, resetAll } = useMapSearch();
  const [selectedPlace, setSelectedPlace] = useState<number[] | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const router = useRouter();
  const searchBarRef = useRef<SearchBarCommands | null>(null);
  const { setCoordinate } = useMapSelectionStore();

  const onMapSelection = (selection: SelectedPoint | null) => {
    if (!selection) return;

    const [longitude, latitude] = selection.coordinate;

    setSelectedPlace([longitude, latitude]);
  };

  const onSubmit = () => {
    if (!selectedPlace) {
      Alert.alert('Error', 'You need to select a place.');
      return;
    }

    setShowSearchResults(false);
    setCoordinate(JSON.stringify(selectedPlace));
    router.back();
  };

  const onCancel = () => {
    router.back();
  };

  const onSearchButtonPress = (text: string) => {
    setSearchQuery?.(text);
  };

  const onCancelSearch = () => {
    setShowSearchResults(false);
  };

  const onSearchResultSelected = () => {
    setShowSearchResults(false);
  };

  useEffect(() => {
    resetAll?.();
  }, [resetAll]);

  useEffect(() => {
    if (searchResults) {
      setShowSearchResults(true);
    }
  }, [searchResults]);

  useEffect(() => {
    if (coordinates) {
      setSelectedPlace([coordinates.longitude, coordinates.latitude]);
      searchBarRef?.current?.cancelSearch();
    }
  }, [coordinates]);

  return {
    state: {
      searchResults,
      coordinates,
      showSearchResults,
      searchBarRef,
    },
    actions: {
      onMapSelection,
      onSubmit,
      onCancel,
      onSearchButtonPress,
      onCancelSearch,
      onSearchResultSelected,
    },
  };
}
