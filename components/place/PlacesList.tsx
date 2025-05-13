import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
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
  isLoading: boolean;
  onRefresh: () => void;
}

export default function PlacesList({ items, isLoading, onRefresh }: PlacesListProps) {
  const router = useRouter();
  const theme = useTheme();

  const { mutate: deleteItem } = useDeletePlace();
  const { mutate: deleteImage } = useDeletImage();

  const handleOnSelectPlace = useCallback((id: number) => {
    router.push(`/${id}`);
  }, []);

  const handleOnEdit = useCallback((id: number) => {
    router.push(`/form?id=${id}`);
  }, []);

  const handleOnDelete = useCallback(
    (id: number) => {
      const item = items?.filter((item) => item.id === id)[0];

      if (!item) return;

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
    },
    [items]
  );

  if (!items || isEmpty(items)) {
    return (
      <Container>
        <ContentUnavailable color={theme.colors.primary} icon="map-outline">
          No Places Added.
        </ContentUnavailable>
      </Container>
    );
  }

  return (
    <Animated.FlatList
      style={styles.list}
      data={items}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyExtractor={(item) => item.id.toString()}
      keyboardDismissMode="on-drag"
      onRefresh={onRefresh}
      refreshing={isLoading}
      renderItem={({ item }) => (
        <PlaceCardItem
          place={item}
          onSelect={handleOnSelectPlace}
          onDelete={handleOnDelete}
          onEdit={handleOnEdit}
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
