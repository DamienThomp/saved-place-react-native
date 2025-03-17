import { Button } from '~/components/ui/Button';
import { useDirections } from '~/providers/DirectionsProvider';
import { Coordinates } from '~/types/types';

type DirectionButtonProps = {
  coordinates: Coordinates;
  color?: string;
};

export default function DirectionButton({ coordinates, color }: DirectionButtonProps) {
  const { setSelectedPoint } = useDirections();

  const onGetDirections = () => {
    if (setSelectedPoint) {
      setSelectedPoint(coordinates);
    }
  };

  return (
    <Button title="Get Directions" icon="directions" color={color} onPress={onGetDirections} />
  );
}
