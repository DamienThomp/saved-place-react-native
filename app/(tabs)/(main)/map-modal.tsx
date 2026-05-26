import { useTheme } from 'expo-router/react-navigation';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBarCommands } from 'react-native-screens';

import Map, { SelectedPoint } from '~/components/map/Map';
import MapSearchListItem from '~/components/map/MapSearchListItem';
import IconButton from '~/components/ui/IconButton';
import { useMapSearch } from '~/providers/MapSearchProvider';
import useMapSelectionStore from '~/stores/mapSelectionStore';

export default function MapModal() {
  const { setSearchQuery, searchResults, coordinates, resetAll } = useMapSearch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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
      showAlert('Error', 'You need to select a place.');
      return;
    }

    setShowSearchResults(false);
    setCoordinate(JSON.stringify(selectedPlace));
    router.back();
  };

  const showAlert = (title: string, message: string) => Alert.alert(title, message);

  useEffect(() => {
    resetAll?.();
  }, []);

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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Select a Location',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerRight: () => (
            <IconButton
              icon="checkmark-circle-outline"
              color="green"
              size={24}
              accessibilityLabel="Submit selected location"
              onPress={onSubmit}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="close-circle-outline"
              color="red"
              size={24}
              accessibilityLabel="Cancel"
              onPress={() => router.back()}
            />
          ),
          headerSearchBarOptions: {
            placeholder: 'Search for a Place',
            inputType: 'text',
            hideWhenScrolling: false,
            headerIconColor: theme.colors.text,
            hintTextColor: theme.colors.border,
            textColor: theme.colors.text,
            onSearchButtonPress: (event) => {
              setSearchQuery?.(event.nativeEvent.text);
            },
            onCancelButtonPress: () => {
              setShowSearchResults(false);
            },
            ref: searchBarRef,
          },
        }}
      />
      <SafeAreaView style={styles.container}>
        <Map onPress={onMapSelection} coordinates={coordinates} />
        {showSearchResults && (
          <Animated.View
            entering={SlideInUp}
            style={[
              styles.listContainer,
              {
                top: insets.top,
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}>
            <FlatList
              data={searchResults?.suggestions}
              keyExtractor={(item) => item.mapbox_id}
              renderItem={({ item }) => (
                <MapSearchListItem
                  item={item}
                  onSelected={() => {
                    setShowSearchResults(false);
                  }}
                />
              )}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    position: 'absolute',
    maxHeight: '30%',
    right: 0,
    left: 0,
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
});
