import { create } from 'zustand';

import type { FormSubmission } from '../types/form';

type SubmissionsState = {
  submissions: FormSubmission[];
  addSubmission: (submission: FormSubmission) => void;
};

export const useSubmissionsStore = create<SubmissionsState>((set) => ({
  submissions: [],

  addSubmission: (submission) => {
    set((state) => ({
      submissions: [submission, ...state.submissions],
    }));
  },
}));
