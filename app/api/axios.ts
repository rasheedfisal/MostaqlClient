import axios from "axios";
import { ILoginResponse } from "../../typings";

// const BASE_URL = "http://localhost:3000/api/v1/";
// const BASE_URL = "https://calm-cyan-bullfrog-tie.cyclic.app/api/v1/";
const BASE_URL = "http://62.171.175.75:3000/api/v1/";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export const privateAuthApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

privateAuthApi.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<ILoginResponse>("auth/refresh");
  return response.data;
};

// privateAuthApi.interceptors.request.use(
//   (config) => {
//     if (config.headers?.Authorization === undefined) {
//       const accessToken = Cookies.get("accessToken");

//       if (accessToken) {
//         const jwt = `Bearer ${JSON.parse(accessToken)}`;
//         config.headers!.Authorization = jwt;
//       }
//     }
//     return config;
//   },
//   (err) => Promise.reject(err)
// );
privateAuthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errStatus = error?.response?.status;
    if (errStatus === 403 && !originalRequest.sent) {
      originalRequest.sent = true;
      const newAccessToken = await refreshAccessTokenFn();
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${newAccessToken.token}`;
      return authApi(originalRequest);
    }
    if (errStatus === 403) {
      document.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
