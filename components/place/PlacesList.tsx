import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import PlaceCardItem from './PlaceCardItem';
import { Container } from '../common/Container';

import { useDeletePlace, useDeletImage } from '~/api/places';
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
  const { mutate: deleteImage } = useDeletImage();

  if (!items || isEmpty(items)) {
    return (
      <Container>
        <ContentUnavailable color={theme.colors.primary} icon="map-outline">
          No Places Added.
        </ContentUnavailable>
      </Container>
    );
  }

  const handleOnSelectPlace = (id: number) => {
    router.push(`/(main)/${id}`);
  };

  const handleOnDelete = (id: number) => {
    const item = items.filter((item) => item.id === id)[0];
    deleteItem(id, {
      onError: () => {
        Alert.alert('Error', 'There was a problem deleting your place');
      },
      onSuccess: () => {
        if (item?.image) {
          deleteImage(item.image);
        }
      },
    });
  };

  return (
    <Animated.FlatList
      style={styles.list}
      data={items}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyExtractor={(item) => item.id.toString()}
      keyboardDismissMode="on-drag"
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
    marginHorizontal: 12,
  },
});
