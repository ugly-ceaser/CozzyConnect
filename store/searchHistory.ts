import { StorageKeys } from "@/constants/Storage";
import { log, removeDuplicates } from "@/utils/helpers";
import { LocalStorage } from "@/utils/storage";
import { create } from "zustand";

interface State{
  history: string[],
}

interface Action {
  clearHistory: () => void;
  appendHistory: (search: string) => void;
  deleteHistory: (search: string) => void;
  initialize: () => Promise<void>
}

export const useSearchHistory = create<State & Action>((set) => ({
  history: [],
  appendHistory: async (search) => {
    let histories = await LocalStorage.getObject<string[]>(StorageKeys.HISTORY) ?? []
    histories.unshift(search)
    
    // REMOVE DUPLICATES
    histories = removeDuplicates(histories)

    // UPDATE STORE
    LocalStorage.setObject(StorageKeys.HISTORY, histories)
    set({ history: histories })
    log("ADDED:", search)
  },
  clearHistory: () => {
    set({ history: [] })
  },
  deleteHistory: async (search) => {
    const histories = await LocalStorage.getObject<string[]>(StorageKeys.HISTORY)
    if(!histories || !histories.length) return
    const index = histories.findIndex(item => item.toLowerCase() === search.toLowerCase())
    if(index === -1) return 
    histories.splice(index, 1)

    // UPDATE THE STORE
    LocalStorage.setObject(StorageKeys.HISTORY, histories)
    set({ history: histories })
  },
  initialize: async () => {
    set({ history: await LocalStorage.getObject<State['history']>(StorageKeys.HISTORY) || [] })
  }
}))