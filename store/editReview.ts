import { JobType } from "@/model/jobs";
import { ReviewResult } from "@/model/review";
import { create } from "zustand";

interface State {
  review: Partial<ReviewResult>;
}

interface Action {
  populate: (review: ReviewResult) => void;
  reset: () => void;
}

const initialState: State = {
  review: {},
};

export const useEditReviewStore = create<State & Action>((set) => ({
  ...initialState,
  populate: (review: ReviewResult) => {
    set({ review });
  },
  reset: () => set({ review: {} }),
}));
