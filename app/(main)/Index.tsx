import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInputFocusEventData,
  Text,
  Alert,
} from 'react-native';

import { usePlacesList, useSearchPlace } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/PlacesList';
import IconButton from '~/components/ui/IconButton';
import { Place } from '~/types/types';

export default function MainView() {
  const [filteredList, setFilteredList] = useState<Place[] | null>(null);
  const [edit, setEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data, error, isLoading } = usePlacesList();
  const navigation = useNavigation();

  const { data: searchResults, error: searchError } = useSearchPlace(searchQuery);

  const onSearch = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setSearchQuery(event.nativeEvent.text);
  };

  const onCancelSearch = () => {
    setSearchQuery('');
  };

  const onTextChanged = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const text = event.nativeEvent.text;
    if (text.length < 1 && data) {
      setSearchQuery('');
    }
  };

  const toggleEdit = () => {
    setEditMode((current: boolean) => {
      return !current;
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }: NativeStackHeaderRightProps) => {
        return edit ? (
          <Pressable onPress={toggleEdit}>
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
        onSearchButtonPress: onSearch,
        onCancelButtonPress: onCancelSearch,
        onChangeText: onTextChanged,
      },
    });
  }, [navigation, filteredList, edit]);

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

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <PlacesList items={filteredList} edit={edit} />
    </LoadingState>
  );
}
