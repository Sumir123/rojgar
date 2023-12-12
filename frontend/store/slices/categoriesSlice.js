import { axiosAPI } from "../../util/axiosAPI";

export const createCategoriesSlice = (set, get) => ({
  categories: [],
  getCategories: async () => {
    try {
      const path = "/api/categories";
      const method = "GET";
      const res = await axiosAPI(method, path);
      set({
        categories: res,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  postCategories: async () => {},
});
