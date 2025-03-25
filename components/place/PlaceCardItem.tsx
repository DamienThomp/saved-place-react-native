import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import RemoteImage from '../common/RemoteImage';
import IconButton from '../ui/IconButton';

import { Place } from '~/types/types';

type PlaceCardItemProps = {
  place: Place;
  edit: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

const PlaceCardItem = memo(({ place, edit, onSelect, onDelete }: PlaceCardItemProps) => {
  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this Place?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        onPress: () => {
          onDelete(place.id);
        },
      },
    ]);
  };

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() => {
        onSelect(place.id);
      }}>
      <RemoteImage style={styles.image} path={place.image} />
      <LinearGradient
        colors={['transparent', 'rgba(37, 37, 37, 0.6)']}
        style={styles.titleBackground}
      />
      {edit && (
        <Animated.View style={styles.editContainer} entering={FadeInDown}>
          <IconButton icon="trash-bin" color="white" size={28} onPress={handleDelete} />
        </Animated.View>
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
    resizeMode: 'cover',
    aspectRatio: 1 / 1,
  },
  editContainer: {
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    margin: 12,
    right: 8,
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'red',
    elevation: 2,
  },
});
