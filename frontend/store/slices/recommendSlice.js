import { axiosAPI } from "../../util/axiosAPI";

export const createRecomendSlice = (set, get) => ({
  recomended: [],
  getrecomendation: async (user_skills, page, limit) => {
    try {
      const path = "/api/recommendation";
      const method = "GET";
      const res = await axiosAPI(
        method,
        path,
        {},
        { user_skills, page, limit }
      );
      set({
        recomended: res,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
});
