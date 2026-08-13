import { useNavigation } from 'expo-router';
import { useTheme } from 'expo-router/react-navigation';
import { useLayoutEffect, useState } from 'react';
import { ColorValue, Pressable, Text, TextInputChangeEvent } from 'react-native';

import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/PlacesList';
import IconButton from '~/components/ui/IconButton';
import { useEditModeNavigation } from '~/hooks/useEditModeNavigation';
import useFilteredPlaces from '~/hooks/useFilteredPlaces';
import useEditModeStore from '~/stores/editModeStore';

export default function MainView() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigation = useNavigation();
  const theme = useTheme();

  const { isEditMode, setEditMode } = useEditModeStore();
  const {
    filteredList,
    isLoading,
    isRefreshing,
    isFetchingNextPage,
    loadMore,
    error,
    refetch,
    emptyMessage,
  } = useFilteredPlaces(searchQuery);

  const onSearch = (event: TextInputChangeEvent) => setSearchQuery(event.nativeEvent.text);

  const onCancelSearch = () => setSearchQuery('');

  const toggleEdit = () => setEditMode(!isEditMode);

  const onTextChanged = (event: TextInputChangeEvent) => {
    const text = event.nativeEvent.text;
    if (text.length < 1) {
      setSearchQuery('');
    }
  };

  useEditModeNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }: { tintColor?: ColorValue }) => {
        return isEditMode ? (
          <Pressable
            accessibilityRole="togglebutton"
            accessibilityLabel="Toggle edit buttons off"
            onPress={toggleEdit}>
            <Text style={{ color: tintColor, fontSize: 18 }}>Done</Text>
          </Pressable>
        ) : (
          <IconButton
            icon="create"
            color={tintColor}
            size={26}
            accessibilityLabel="Toggle edit buttons on"
            onPress={toggleEdit}
          />
        );
      },
      headerSearchBarOptions: {
        placeholder: 'Search',
        inputType: 'text',
        headerIconColor: theme.colors.text,
        hintTextColor: theme.colors.border,
        textColor: theme.colors.text,
        onSearchButtonPress: onSearch,
        onCancelButtonPress: onCancelSearch,
        onChangeText: onTextChanged,
      },
    });
  }, [navigation, filteredList, isEditMode]);

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <PlacesList
        items={filteredList}
        onRefresh={refetch}
        isLoadingInitial={isLoading}
        isRefreshing={isRefreshing}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={loadMore}
        emptyMessage={emptyMessage}
      />
    </LoadingState>
  );
}
