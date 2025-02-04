import { DefaultStoreValues } from "@/model/store";
import { create } from "zustand";
import {  UserResponseData } from "@/model/user";
import { LocalStorage } from "@/utils/storage";
import { StorageKeys } from "@/constants/Storage";
import { DEFAULT_USER } from "@/contents/user";

type InitialStateType = {
  user?: UserResponseData;
  token: string;
}
const initialState: InitialStateType = {
  user: undefined,
  token: ""
};

interface Actions {
  setToken: (token: string, persist?: boolean) => Promise<void>
  setUser: (data: UserResponseData, persist?: boolean) => Promise<void>
}

export const useUserStore = create<
  InitialStateType & DefaultStoreValues<InitialStateType> & Actions
>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  updateItem: (key, value) => {
    set({ [key]: value });
  },
  setUser: async (value, persist?: boolean) => {
    value.profilePicture = value?.profilePicture?.toLowerCase().startsWith('sample') ? DEFAULT_USER.profilePicture : value.profilePicture
    if(persist) await LocalStorage.setObject(StorageKeys.USER, value)
    set({ user: value });
  },
  setToken: async (value, persist?: boolean) => {
    if(persist) await LocalStorage.setItem(StorageKeys.TOKEN, value)
    set({ token: value });
  },
}));
