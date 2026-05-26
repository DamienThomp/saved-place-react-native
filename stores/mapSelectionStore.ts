import { create } from 'zustand';

export type MapSelectionStore = {
    coordinate: string | null;
    setCoordinate: (coordinate: string | null) => void;
    clear: () => void;
};

const useMapSelectionStore = create<MapSelectionStore>((set) => ({
    coordinate: null,
    setCoordinate: (coordinate) => set({coordinate}),
    clear: () => set({coordinate: null})
}));

export default useMapSelectionStore;
