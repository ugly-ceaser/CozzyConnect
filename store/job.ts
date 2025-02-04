import { JobType } from "@/model/jobs";
import { create } from "zustand"


interface State {
  recommendedJobs: JobType[];
  newJobs: JobType[]
}

interface Action {
  populate: (key: keyof State, value: JobType[]) => void;
  reset: () => void
}

const initialState: State = {
  newJobs: [],
  recommendedJobs: []
}

export const useJobStore = create<State & Action>((set) => ({
  ...initialState,
  populate: (key, value) => {
    set({ [key]: value })
  },
  reset: () => set({ newJobs: [], recommendedJobs: [] })
}))
