import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { NativeSyntheticEvent, Pressable, TextInputFocusEventData, Text, View } from 'react-native';

import { usePlacesList } from '~/api/places';
import { Container } from '~/components/common/Container';
import LoadingState from '~/components/common/LoadingState';
import PlacesList from '~/components/place/PlacesList';
import IconButton from '~/components/ui/IconButton';
import { Place } from '~/types/types';

export default function MainView() {
  const [filteredList, setFilteredList] = useState<Place[] | null>(null);
  const [edit, setEditMode] = useState<boolean>(false);
  const { data, error, isLoading } = usePlacesList();
  const navigation = useNavigation();

  const onSearch = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!filteredList) return;
    const filtered = filteredList.filter((place) => place.title.includes(event.nativeEvent.text));
    setFilteredList(filtered);
  };

  const onCancelSearch = () => {
    if (data) {
      setFilteredList(data);
    }
  };

  const onTextChanged = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const text = event.nativeEvent.text;
    if (text.length < 1 && data) {
      setFilteredList(data);
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
    if (data) {
      setFilteredList(data);
    }
  }, [data]);

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Container>
        <PlacesList items={filteredList} edit={edit} />
      </Container>
    </LoadingState>
  );
}
