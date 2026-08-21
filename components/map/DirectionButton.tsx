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
  const { requestDirections, error, setError, isFetching } = useDirections();

  const onGetDirections = async () => {
    await requestDirections?.(coordinates);
    onDirectionsRequested?.();
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Unable to get directions!', error);
    }
    return () => {
      setError?.(undefined);
    };
  }, [error, setError]);

  return (
    <Button
      title={isFetching ? 'Getting directions...' : 'Get Directions'}
      icon={isFetching ? undefined : 'directions'}
      color={color}
      onPress={onGetDirections}
      disabled={isFetching}
      style={style}
    />
  );
}
