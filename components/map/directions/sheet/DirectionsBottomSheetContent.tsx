import { StyleSheet, View } from 'react-native';

import DirectionButton from '~/components/map/DirectionButton';
import { Coordinates } from '~/types/types';

type DirectionsBottomSheetContentProps = {
  coordinates: Coordinates;
  onDirectionsRequested?: () => void;
};

export default function DirectionsBottomSheetContent({
  coordinates,
  onDirectionsRequested,
}: DirectionsBottomSheetContentProps) {
  return (
    <View style={styles.container}>
      <DirectionButton
        coordinates={coordinates}
        color="white"
        style={styles.fullWidthButton}
        onDirectionsRequested={onDirectionsRequested}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
});
