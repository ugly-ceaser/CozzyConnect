import { PropertyType } from "@/model/property";
import { create } from "zustand"


export interface FilterStore {
  state?: string;
  lga?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedroom?: number;
}

const initialState: FilterStore = {
  bedroom: undefined,
  lga: "",
  maxPrice: undefined,
  minPrice: undefined,
  state: "",
  type: "",
}

interface Actions {
  update: (data: FilterStore) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore & Actions>((set) => ({
  ...initialState,
  update: (data) => {
    set((prev) => ({...prev, ...data}))
  },
  reset: () => set(initialState)
}))
