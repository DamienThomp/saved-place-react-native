import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet } from 'react-native';

import { useDeletePlace } from '~/api/places';
import ContentUnavailable from '~/components/common/ContentUnavailable';
import PlaceListItem from '~/components/place/PlaceListItem';
import { Tables } from '~/types/database.types';
import isEmpty from '~/utils/isEmpty';

type Places = Tables<'places'>;
interface PlacesListProps {
  items: Places[] | null | undefined;
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
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PlaceListItem item={item} onSelect={handleOnSelectPlace} onDelete={handleOnDelete} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 12,
  },
});
