import axios from "axios";

const origin = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error?.response &&
      error?.response?.status === 401 &&
      error?.response?.data?.detail === "Token has expired"
    ) {
      const tokenExpireError = new Error(
        "Token has expired. Please log in again."
      );
      tokenExpireError.name = "TokenExpireError";
      throw tokenExpireError;
    } else {
      throw error;
    }
  }
);

export const axiosAPI = async (
  method,
  path,
  headers = {},
  params = {},
  data = null,
  cancelToken
) => {
  const allHeaders = {
    accept: "application/json",
    ...headers,
  };

  if (path.indexOf("/") === 0) {
    path = origin + path;
  }
  const options = {
    method,
    headers: allHeaders,
    params,
    withCredentials: true,
  };

  if (data) {
    options.data = data;
  }

  if (cancelToken) {
    options.cancelToken = cancelToken;
  }
  try {

    const response = await axios(path, options);
    return response?.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.log("JSON/Network error:", error);
      throw error;
    }
  }
};
