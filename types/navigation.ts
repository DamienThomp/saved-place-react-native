import { DirectionType } from '~/api/directions';
import { Coordinates } from '~/types/types';

export type NavigationParams = {
  origin: Coordinates;
  destination: Coordinates;
  mode: DirectionType;
  title: string;
};
