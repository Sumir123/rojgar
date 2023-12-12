import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { axiosAPI } from "../../util/axiosAPI";

export const getUserProfile = async () => {
  const path = "/api/profile";
  const method = "GET";
  return await axiosAPI(method, path);
};

export const postUserProfile = async (data) => {
  const path = "/api/profile";
  const method = "POST";
  return await axiosAPI(method, path, {}, {}, data);
};

export const ApplyForJobs = async (data, usersData) => {
  const path = "/api/apply";
  const method = "POST";
  return await axiosAPI(method, path, {}, usersData, data);
};

export const getApplication = async () => {
  const path = "/api/applications/me";
  const method = "GET";
  return await axiosAPI(method, path);
};
export const getMyApplication = async () => {
  const path = "/api/application";
  const method = "GET";
  return await axiosAPI(method, path);
};

export const getJobs = async (parms) => {
  const path = "/api/jobs";
  const method = "GET";
  return await axiosAPI(method, path, {}, parms);
};

export const getRecommendedJobs = async (parms) => {
  const path = "/api/recommendation";
  const method = "GET";

  return await axiosAPI(method, path, {}, parms);
};

export const getUserDetails = async (user_id) => {
  const path = "/users/" + user_id;
  const method = "GET";

  return await axiosAPI(method, path);
};
