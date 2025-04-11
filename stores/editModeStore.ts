import { create } from 'zustand';

export type EditModeStore = {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
};

const useEditModeStore = create<EditModeStore>()((set) => ({
  isEditMode: false,
  setEditMode: (value: boolean) => set({ isEditMode: value }),
}));

export default useEditModeStore;
