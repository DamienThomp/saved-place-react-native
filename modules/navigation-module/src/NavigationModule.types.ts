import type { StyleProp, ViewStyle } from 'react-native';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type NavigationMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

export type OnArrivedEventPayload = {
  latitude: number;
  longitude: number;
};

export type OnCancelEventPayload = {
  reason?: 'user' | 'error' | 'reroute';
};

export type NavigationModuleViewProps = {
  origin: Coordinates;
  destination: Coordinates;
  mode: NavigationMode;
  onArrived?: (event: { nativeEvent: OnArrivedEventPayload }) => void;
  onCancel?: (event: { nativeEvent: OnCancelEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
