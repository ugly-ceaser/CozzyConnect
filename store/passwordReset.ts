import { UserResponseData } from "@/model/user";
import { create } from "zustand"


interface State {
  email: string;
  id?: string;
}

interface Action {
  populate: (key: keyof State, value: string) => void;
  reset: () => void
}

const initialState: State  = {
  email: '',
  id: '',
}

export const usePasswordResetStore = create<State & Action>((set) => ({
  ...initialState,
  populate: (key, value) => {
    set({ [key]: value })
  },
  reset: () => set({ email: '', id: '' })
}))
