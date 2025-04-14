import { useTheme } from '@react-navigation/native';
import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { NativeSyntheticEvent, Pressable, Text, TextInputFocusEventData } from 'react-native';

import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/PlacesList';
import IconButton from '~/components/ui/IconButton';
import { useEditModeNavigation } from '~/hooks/useEditModeNavigation';
import useFilteredPlaces from '~/hooks/useFilteredPlaces';
import useEditModeStore from '~/stores/editModeStore';

type TextInputEvent = NativeSyntheticEvent<TextInputFocusEventData>;

export default function MainView() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigation = useNavigation();
  const theme = useTheme();

  const { isEditMode, setEditMode } = useEditModeStore();
  const { filteredList, isLoading, error } = useFilteredPlaces(searchQuery);

  const onSearch = (event: TextInputEvent) => setSearchQuery(event.nativeEvent.text);

  const onCancelSearch = () => setSearchQuery('');

  const toggleEdit = () => setEditMode(!isEditMode);

  const onTextChanged = (event: TextInputEvent) => {
    const text = event.nativeEvent.text;
    if (text.length < 1) {
      setSearchQuery('');
    }
  };

  useEditModeNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }: NativeStackHeaderRightProps) => {
        return isEditMode ? (
          <Pressable onPress={toggleEdit} style={{ paddingRight: 16 }}>
            <Text style={{ color: tintColor, fontSize: 18 }}>Done</Text>
          </Pressable>
        ) : (
          <IconButton
            icon="create"
            color={tintColor}
            size={26}
            onPress={toggleEdit}
            style={{ paddingLeft: 0 }}
          />
        );
      },
      headerSearchBarOptions: {
        placeholder: 'Search',
        inputType: 'text',
        hideWhenScrolling: false,
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
      <PlacesList items={filteredList} />
    </LoadingState>
  );
}
