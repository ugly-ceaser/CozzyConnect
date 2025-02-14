import { create } from "zustand"


interface DrawerStore {
  isOpen: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  closeDrawer: () => set({ isOpen: false }),
  openDrawer: () => set({ isOpen: true })
}))
