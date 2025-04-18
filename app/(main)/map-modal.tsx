import { useTheme } from '@react-navigation/native';
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

export default function MapModal() {
  const { setSearchQuery, searchResults, coordinates, resetAll } = useMapSearch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedPlace, setSelectedPlace] = useState<number[] | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const router = useRouter();
  const searchBarRef = useRef<SearchBarCommands | null>(null);

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
    router.back();
    router.setParams({ coordinate: JSON.stringify(selectedPlace) });
    setShowSearchResults(false);
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
        name="map-modal"
        options={{
          title: 'Select a Location',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerRight: () => (
            <IconButton
              icon="checkmark-circle-outline"
              color="green"
              size={24}
              onPress={onSubmit}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="close-circle-outline"
              color="red"
              size={24}
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
