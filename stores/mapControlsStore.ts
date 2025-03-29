import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { create } from 'zustand';

type MapControlActions = {
  setMapCenter: (position: Position) => void;
  setMapPitch: (value: number) => void;
  toggleMapPitch: (value: boolean) => void;
};

type MapControlsStore = {
  pitchIsToggled: boolean;
  mapPitch: number;
  mapCenter?: Position;
  actions: MapControlActions;
};

const useMapControlStore = create<MapControlsStore>()((set) => ({
  pitchIsToggled: false,
  mapPitch: 0,
  mapCenter: undefined,
  actions: {
    setMapCenter: (position) => set({ mapCenter: position }),
    setMapPitch: (value) => {
      set({ mapPitch: value });
    },
    toggleMapPitch: (value) => set({ pitchIsToggled: value }),
  },
}));

export const useIsPitchToggled = () => useMapControlStore((state) => state.pitchIsToggled);
export const useMapCenter = () => useMapControlStore((state) => state.mapCenter);
export const useMapPitch = () => useMapControlStore((state) => state.mapPitch);
export const useMapActions = () => useMapControlStore((state) => state.actions);
