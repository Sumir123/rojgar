import { axiosAPI } from "../../util/axiosAPI";

export const createJobsSlice = (set, get) => ({
  jobs: [],
  getJobs: async (page) => {
    try {
      const path = "/api/jobs?page=" + page;
      const method = "GET";
      const res = await axiosAPI(method, path);
      set({
        jobs: res,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  postJobs: async (data) => {
    try {
      const path = "/api/jobs";
      const method = "POST";
      const res = await axiosAPI(method, path, {}, {}, data);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
});
