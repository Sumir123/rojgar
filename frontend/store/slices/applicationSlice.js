import { axiosAPI } from "../../util/axiosAPI";

export const createApplicationsSlice = (set, get) => ({
  applications: [],
  getApplications: async () => {
    try {
      const path = "/api/application";
      const method = "GET";
      const res = await axiosAPI(method, path);
      set({
        applications: res,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  postApplications: async () => {},
});
