import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import PlaceCardItem from './PlaceCardItem';

import { useDeletePlace } from '~/api/places';
import ContentUnavailable from '~/components/common/ContentUnavailable';
import { Place } from '~/types/types';
import isEmpty from '~/utils/isEmpty';

interface PlacesListProps {
  items: Place[] | null | undefined;
  edit: boolean;
}

export default function PlacesList({ items, edit }: PlacesListProps) {
  const router = useRouter();
  const theme = useTheme();

  const { mutate: deleteItem } = useDeletePlace();

  if (!items || isEmpty(items)) {
    return (
      <ContentUnavailable color={theme.colors.primary} icon="map-outline">
        No Places Added.
      </ContentUnavailable>
    );
  }

  const handleOnSelectPlace = (id: number) => {
    router.push(`/(main)/${id}`);
  };

  // TODO: add delete UI to card version of places list item
  const handleOnDelete = (id: number) => {
    deleteItem(id, {
      onError: () => {
        Alert.alert('Error', 'There was a problem deleting your place');
      },
    });
  };

  return (
    <Animated.FlatList
      style={styles.list}
      data={items}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PlaceCardItem
          place={item}
          onSelect={handleOnSelectPlace}
          edit={edit}
          onDelete={handleOnDelete}
        />
      )}
      itemLayoutAnimation={LinearTransition.duration(250)}
      windowSize={2}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 12,
  },
});
