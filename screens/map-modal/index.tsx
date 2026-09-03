import { useTheme } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Map from '~/components/map/Map';
import MapSearchListItem from '~/components/map/MapSearchListItem';
import IconButton from '~/components/ui/IconButton';
import { tokens } from '~/constants/theme';

import { useMapModalViewModel } from './useMapModalViewModel';

export default function MapModal() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { state, actions } = useMapModalViewModel();

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
              color={tokens.colors.success}
              size={24}
              accessibilityLabel="Submit selected location"
              onPress={actions.onSubmit}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="close-circle-outline"
              color={tokens.colors.destructive}
              size={24}
              accessibilityLabel="Cancel"
              onPress={actions.onCancel}
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
              actions.onSearchButtonPress(event.nativeEvent.text);
            },
            onCancelButtonPress: actions.onCancelSearch,
            ref: state.searchBarRef,
          },
        }}
      />
      <SafeAreaView style={styles.container}>
        <Map onPress={actions.onMapSelection} coordinates={state.coordinates} />
        {state.showSearchResults && (
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
              data={state.searchResults?.suggestions}
              keyExtractor={(item) => item.mapbox_id}
              renderItem={({ item }) => (
                <MapSearchListItem item={item} onSelected={actions.onSearchResultSelected} />
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
    marginLeft: tokens.spacing.sm,
    marginRight: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
  },
});
