import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import RemoteImage from '../../common/RemoteImage';
import IconButton from '../../ui/IconButton';

import { tokens } from '~/constants/theme';
import useEditMoreStore from '~/stores/editModeStore';
import { Place } from '~/types/types';

type PlaceCardItemProps = {
  place: Place;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const PlaceCardItem = ({ place, onSelect, onDelete, onEdit }: PlaceCardItemProps) => {
  const { isEditMode } = useEditMoreStore();
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

  const handlePress = () => onSelect(place.id);
  const handleOnEdit = () => onEdit(place.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Show details for ${place.title}`}
      accessibilityHint="Opens place details screen."
      style={styles.cardContainer}
      onPress={handlePress}>
      <RemoteImage style={styles.image} path={place.image} />
      <LinearGradient
        colors={['transparent', tokens.colors.overlay.gradientEnd]}
        style={styles.titleBackground}
      />
      {isEditMode && (
        <>
          <Animated.View style={[styles.editContainer, styles.deleteItem]} entering={FadeInDown}>
            <IconButton
              icon="trash-bin"
              color={tokens.colors.white}
              size={28}
              accessibilityLabel={`Delete ${place.title}`}
              onPress={handleDelete}
            />
          </Animated.View>
          <Animated.View style={[styles.editContainer, styles.editItem]} entering={FadeInDown}>
            <IconButton
              icon="pencil"
              color={tokens.colors.white}
              size={28}
              accessibilityLabel={`Edit ${place.title}`}
              onPress={handleOnEdit}
            />
          </Animated.View>
        </>
      )}
      <Text style={styles.title}>{place.title}</Text>
    </Pressable>
  );
};

export default PlaceCardItem;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: tokens.borderRadius.pill,
    overflow: 'hidden',
    marginVertical: tokens.spacing.sm,
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
    bottom: tokens.spacing.sm,
    padding: tokens.spacing.md,
    ...tokens.typography.title,
    color: tokens.colors.white,
  },
  image: {
    aspectRatio: 1 / 1,
  },
  editContainer: {
    justifyContent: 'center',
    position: 'absolute',
    top: tokens.spacing.sm,
    margin: tokens.spacing.md,
    padding: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.md,
    ...tokens.shadows.card,
  },
  editItem: {
    backgroundColor: tokens.colors.success,
    left: tokens.spacing.sm,
  },
  deleteItem: {
    backgroundColor: tokens.colors.destructive,
    right: tokens.spacing.sm,
  },
});
