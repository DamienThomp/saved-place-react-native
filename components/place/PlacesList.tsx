import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { useDeletePlace } from '~/api/places';
import ContentUnavailable from '~/components/common/ContentUnavailable';
import PlaceListItem from '~/components/place/PlaceListItem';
import { Place } from '~/types/types';
import isEmpty from '~/utils/isEmpty';

interface PlacesListProps {
  items: Place[] | null | undefined;
}

export default function PlacesList({ items }: PlacesListProps) {
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
        <PlaceListItem item={item} onSelect={handleOnSelectPlace} onDelete={handleOnDelete} />
      )}
      itemLayoutAnimation={LinearTransition.duration(250)}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 12,
  },
});
