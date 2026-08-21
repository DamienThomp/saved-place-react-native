import { DirectionType } from '~/api/directions';

export const DIRECTION_MODES = [
  { label: 'Drive', value: DirectionType.Driving },
  { label: 'Walk', value: DirectionType.Walking },
  { label: 'Cycle', value: DirectionType.Cycling },
  { label: 'Traffic', value: DirectionType.DrivingTraffic },
] as const;

export type DirectionTypeSelectorProps = {
  value: DirectionType;
  onChange: (mode: DirectionType) => void;
};
