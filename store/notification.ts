import { NotificationType } from "@/model/notification";
import { create } from "zustand";

interface State {
  notifications: NotificationType[],
}

interface Action {
  initialize: (notifications: NotificationType[]) => void
}

export const useNotificationStore = create<State & Action>((set) => ({
  notifications: [],
  initialize: (notifications) => {
    set({ notifications })
  }
}))