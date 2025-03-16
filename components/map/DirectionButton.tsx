import { Button } from '~/components/ui/Button';
import { useLocation } from '~/providers/LocationProvider';
import { Coordinates } from '~/types/types';

type DirectionButtonProps = {
  coordinates: Coordinates;
  color?: string;
};

export default function DirectionButton({ coordinates, color }: DirectionButtonProps) {
  const { setSelectedPoint } = useLocation();

  const onGetDirections = () => {
    if (setSelectedPoint) {
      setSelectedPoint(coordinates);
    }
  };

  return (
    <Button title="Get Directions" icon="directions" color={color} onPress={onGetDirections} />
  );
}
