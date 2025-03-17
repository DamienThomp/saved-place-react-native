import { SearchBoxSuggestion } from '@mapbox/search-js-core';
import { useTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Map, { SelectedPoint } from '~/components/map/Map';
import IconButton from '~/components/ui/IconButton';
import { useMapSearch } from '~/providers/MapSearchProvider';

export default function MapModal() {
  const { setSelectedResult, setSearchQuery, searchResults, coordinates, resetAll } =
    useMapSearch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedPlace, setSelectedPlace] = useState<number[] | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const router = useRouter();

  const onMapSelection = (selection: SelectedPoint | null) => {
    if (!selection) return;

    const [longitude, latitude] = selection.coordinate;

    setSelectedPlace([longitude, latitude]);
  };

  const onSubmit = () => {
    router.back();
    router.setParams({ coordinate: JSON.stringify(selectedPlace) });
    setShowSearchResults(false);
  };

  const onSelectSearchResult = (item: SearchBoxSuggestion) => {
    setSelectedResult?.(item);
    setShowSearchResults(false);
  };

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
    }
  }, [coordinates]);

  return (
    <>
      <Stack.Screen
        name="map-modal"
        options={{
          title: 'Select a Location',
          presentation: 'modal',
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
            onSearchButtonPress: (event) => {
              setSearchQuery?.(event.nativeEvent.text);
            },
          },
        }}
      />
      <View style={{ flex: 1 }}>
        <Map onPress={onMapSelection} coordinates={coordinates} />
        {showSearchResults && (
          <FlatList
            style={[
              styles.listContainer,
              {
                top: insets.top,
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            data={searchResults?.suggestions}
            keyExtractor={(item) => item.mapbox_id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelectSearchResult(item);
                }}
                style={[styles.listItem, { borderBlockColor: theme.colors.border }]}>
                <Text style={[styles.listItemInfo, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={{ color: theme.colors.text, opacity: 0.8 }}>
                  {item.place_formatted}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    position: 'absolute',
    maxHeight: '30%',
    right: 0,
    left: 0,
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  listItem: {
    flex: 1,
    padding: 22,
    borderBottomWidth: 1,
  },
  listItemInfo: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});
