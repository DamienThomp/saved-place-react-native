import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

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

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PlaceListItem item={item} onSelect={handleOnSelectPlace} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 12,
  },
});
