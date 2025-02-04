import { FlatList, StyleSheet } from 'react-native';

import ContentUnavailable from '~/components/common/ContentUnavailable';
import PlaceListItem from '~/components/place/PlaceListItem';
import type Place from '~/model/Place';
import isEmpty from '~/utils/isEmpty';

interface PlacesListProps {
  items: Place[];
}

export default function PlacesList({ items }: PlacesListProps) {
  if (isEmpty(items)) {
    return (
      <ContentUnavailable color="grey" icon="map-outline">
        No Places Added.
      </ContentUnavailable>
    );
  }

  const handleOnSelectPlace = (id: string) => {};

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PlaceListItem item={item} onSelect={handleOnSelectPlace} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
});
