import { StyleURL } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { create } from 'zustand';

const DEFAULTS = {
  zoomLevel: 14,
  mapTheme: StyleURL.Street,
  mapPitch: 0,
  isLightMode: true,
  pitchIsToggled: false,
};

type MapControlActions = {
  setMapZoomLevel: (value: number) => void;
  setMapCenter: (position: Position) => void;
  setMapPitch: (value: number) => void;
  toggleLightMode: (value: boolean) => void;
  toggleMapPitch: (value: boolean) => void;
  resetAll: () => void;
};

type MapControlsStore = {
  zoomLevel: number;
  mapTheme: StyleURL;
  isLightMode: boolean;
  pitchIsToggled: boolean;
  mapPitch: number;
  mapCenter?: Position;
  actions: MapControlActions;
};

const initialState: Omit<MapControlsStore, 'actions'> = {
  ...DEFAULTS,
  mapCenter: undefined,
};

const useMapControlStore = create<MapControlsStore>()((set) => ({
  ...initialState,
  actions: {
    setMapZoomLevel: (value) => set({ zoomLevel: value }),
    setMapCenter: (position) => set({ mapCenter: position }),
    setMapPitch: (value) => {
      set({ mapPitch: value });
    },
    toggleMapPitch: (value) => set({ pitchIsToggled: value, mapPitch: value ? 60 : 0 }),
    toggleLightMode: (value) =>
      set({ isLightMode: value, mapTheme: value ? StyleURL.Street : StyleURL.TrafficNight }),
    resetAll: () => set({ ...initialState }),
  },
}));

export const useMapZoomLevel = () => useMapControlStore((state) => state.zoomLevel);
export const useMapTheme = () => useMapControlStore((state) => state.mapTheme);
export const useIsLightMode = () => useMapControlStore((state) => state.isLightMode);
export const useIsPitchToggled = () => useMapControlStore((state) => state.pitchIsToggled);
export const useMapCenter = () => useMapControlStore((state) => state.mapCenter);
export const useMapPitch = () => useMapControlStore((state) => state.mapPitch);
export const useMapActions = () => useMapControlStore((state) => state.actions);
