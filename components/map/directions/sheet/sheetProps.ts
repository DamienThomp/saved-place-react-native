import { Coordinates } from '~/types/types';

export type DirectionsBottomSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
  coordinates: Coordinates;
  title: string;
};
