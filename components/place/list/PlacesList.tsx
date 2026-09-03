import { useTheme } from 'expo-router/react-navigation';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import PlaceCardItem from './PlaceCardItem';

import { useDeletePlace, useDeletImage } from '~/api/places';
import ContentUnavailable from '~/components/common/ContentUnavailable';
import { Place } from '~/types/types';

interface PlacesListProps {
  items: Place[] | null | undefined;
  isLoadingInitial: boolean;
  isRefreshing: boolean;
  isFetchingNextPage?: boolean;
  emptyMessage?: string;
  onRefresh: () => void;
  onEndReached?: () => void;
}

export default function PlacesList({
  items,
  isLoadingInitial,
  isRefreshing,
  isFetchingNextPage,
  emptyMessage,
  onRefresh,
  onEndReached,
}: PlacesListProps) {
  const router = useRouter();
  const theme = useTheme();

  const { mutate: deleteItem } = useDeletePlace();
  const { mutate: deleteImage } = useDeletImage();

  const listData = items ?? [];

  const handleOnSelectPlace = (id: number) => {
    router.push(`/${id}`);
  };

  const handleOnEdit = (id: number) => {
    router.push(`/form?id=${id}`);
  };

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
    [items, deleteImage, deleteItem]
  );

  return (
    <Animated.FlatList
      style={styles.list}
      data={listData}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, listData.length === 0 && styles.emptyContent]}
      keyExtractor={(item) => item.id.toString()}
      keyboardDismissMode="on-drag"
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={3}
      maxToRenderPerBatch={2}
      ListEmptyComponent={
        !isLoadingInitial
          ? () => (
              <ContentUnavailable color={theme.colors.primary} icon="map-outline">
                {emptyMessage ?? 'No Places Added.'}
              </ContentUnavailable>
            )
          : null
      }
      ListFooterComponent={
        isFetchingNextPage ? () => <ActivityIndicator style={styles.footer} /> : null
      }
      renderItem={({ item }) => (
        <PlaceCardItem
          place={item}
          onSelect={handleOnSelectPlace}
          onDelete={handleOnDelete}
          onEdit={handleOnEdit}
        />
      )}
      itemLayoutAnimation={LinearTransition.duration(250)}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    marginHorizontal: 12,
  },
  content: {
    paddingBottom: 48,
  },
  emptyContent: {
    flexGrow: 1,
  },
  footer: {
    padding: 16,
  },
});
