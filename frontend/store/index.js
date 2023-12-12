import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice } from "./slices/authSlice";
import { createApplicationsSlice } from "./slices/applicationSlice";
import { createJobsSlice } from "./slices/jobsSlice";
import { createRecomendSlice } from "./slices/recommendSlice";
import { createCategoriesSlice } from "./slices/categoriesSlice";

export const useStoreState = create(
  devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createApplicationsSlice(...a),
    ...createJobsSlice(...a),
    ...createRecomendSlice(...a),
    ...createCategoriesSlice(...a),
  }))
);
