import { DefaultStoreValues } from "@/model/store";
import { create } from "zustand";

type InitialStateType = {
  email?: string;
  name?: string;
  password?: string;
  code?: string; 
}
const initialState: InitialStateType = {
  code: '',
  name: '',
  password: '',
  email: '',
};

interface Actions {
}

export const useRegistrationStore = create<
  InitialStateType & DefaultStoreValues<InitialStateType> & Actions
>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  updateItem: (key, value) => {
    set({ [key]: value });
  },
  populate: (data) => set(data)
}));
