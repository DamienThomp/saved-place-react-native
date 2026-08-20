import type { Position } from 'geojson';
import { create } from 'zustand';

import { MAP_CAMERA } from '~/utils/mapBoxUtils';

type CameraCommand = {
  center?: Position;
  zoom?: number;
  sequence: number;
};

type MapControlActions = {
  flyTo: (center: Position, zoom?: number) => void;
  setZoom: (zoom: number) => void;
  setLightMode: (value: boolean) => void;
  toggleLightMode: () => void;
  setPitchToggled: (value: boolean) => void;
  toggleMapPitch: () => void;
  resetAll: () => void;
};

type MapControlsStore = {
  isLightMode: boolean;
  pitchIsToggled: boolean;
  mapPitch: number;
  cameraCommand: CameraCommand | null;
  actions: MapControlActions;
};

const initialState: Omit<MapControlsStore, 'actions'> = {
  isLightMode: true,
  pitchIsToggled: false,
  mapPitch: 0,
  cameraCommand: null,
};

const nextSequence = (current: CameraCommand | null) => (current?.sequence ?? 0) + 1;

const useMapControlStore = create<MapControlsStore>()((set) => ({
  ...initialState,
  actions: {
    flyTo: (center, zoom) =>
      set((state) => ({
        cameraCommand: {
          center,
          zoom,
          sequence: nextSequence(state.cameraCommand),
        },
      })),
    setZoom: (zoom) =>
      set((state) => ({
        cameraCommand: {
          zoom,
          sequence: nextSequence(state.cameraCommand),
        },
      })),
    setLightMode: (value) => set({ isLightMode: value }),
    toggleLightMode: () => set((state) => ({ isLightMode: !state.isLightMode })),
    setPitchToggled: (value) =>
      set({
        pitchIsToggled: value,
        mapPitch: value ? MAP_CAMERA.PITCH_ANGLE : 0,
      }),
    toggleMapPitch: () =>
      set((state) => {
        const pitchIsToggled = !state.pitchIsToggled;
        return {
          pitchIsToggled,
          mapPitch: pitchIsToggled ? MAP_CAMERA.PITCH_ANGLE : 0,
        };
      }),
    resetAll: () => set({ ...initialState }),
  },
}));

export const useIsLightMode = () => useMapControlStore((state) => state.isLightMode);
export const useIsPitchToggled = () => useMapControlStore((state) => state.pitchIsToggled);
export const useMapPitch = () => useMapControlStore((state) => state.mapPitch);
export const useCameraCommand = () => useMapControlStore((state) => state.cameraCommand);
export const useMapActions = () => useMapControlStore((state) => state.actions);
