import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import RemoteImage from '../common/RemoteImage';
import IconButton from '../ui/IconButton';

import useEditMoreStore from '~/stores/editModeStore';
import { Place } from '~/types/types';

type PlaceCardItemProps = {
  place: Place;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const PlaceCardItem = memo(({ place, onSelect, onDelete, onEdit }: PlaceCardItemProps) => {
  const { isEditMode } = useEditMoreStore();
  const handleDelete = useCallback(() => {
    Alert.alert('Delete', 'Are you sure you want to delete this Place?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        onPress: () => {
          onDelete(place.id);
        },
      },
    ]);
  }, [onDelete, place.id]);

  const handlePress = useCallback(() => onSelect(place.id), [onSelect, place.id]);
  const handleOnEdit = useCallback(() => onEdit(place.id), [onEdit, place.id]);

  return (
    <Pressable style={styles.cardContainer} onPress={handlePress}>
      <RemoteImage style={styles.image} path={place.image} />
      <LinearGradient
        colors={['transparent', 'rgba(37, 37, 37, 0.6)']}
        style={styles.titleBackground}
      />
      {isEditMode && (
        <>
          <Animated.View style={[styles.editContainer, styles.deleteItem]} entering={FadeInDown}>
            <IconButton icon="trash-bin" color="white" size={28} onPress={handleDelete} />
          </Animated.View>
          <Animated.View style={[styles.editContainer, styles.editItem]} entering={FadeInDown}>
            <IconButton icon="pencil" color="white" size={28} onPress={handleOnEdit} />
          </Animated.View>
        </>
      )}
      <Text style={styles.title}>{place.title}</Text>
    </Pressable>
  );
});

export default PlaceCardItem;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 8,
    position: 'relative',
  },
  titleBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  title: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    aspectRatio: 1 / 1,
  },
  editContainer: {
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    margin: 12,
    padding: 4,
    borderRadius: 8,
    elevation: 2,
  },
  editItem: {
    backgroundColor: 'green',
    left: 8,
  },
  deleteItem: {
    backgroundColor: 'red',
    right: 8,
  },
});
