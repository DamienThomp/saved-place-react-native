import { useEffect } from 'react';
import { Alert, PressableProps } from 'react-native';

import { Button } from '~/components/ui/Button';
import { useDirections } from '~/providers/DirectionsProvider';
import { Coordinates } from '~/types/types';

type DirectionButtonProps = {
  coordinates: Coordinates;
  color?: string;
  onDirectionsRequested?: () => void;
  style?: PressableProps['style'];
};

export default function DirectionButton({
  coordinates,
  color,
  onDirectionsRequested,
  style,
}: DirectionButtonProps) {
  const { setSelectedPoint, error, setError } = useDirections();

  const onGetDirections = () => {
    if (setSelectedPoint) {
      setSelectedPoint(coordinates);
    }
    onDirectionsRequested?.();
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Unable to get directions!', error);
    }
    return () => {
      setError?.(undefined);
    };
  }, [error]);

  return (
    <Button
      title="Get Directions"
      icon="directions"
      color={color}
      onPress={onGetDirections}
      style={style}
    />
  );
}
