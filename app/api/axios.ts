import axios, { AxiosResponse } from "axios";
import { ILoginResponse } from "../../typings";
import { HttpError, httpErrorHandler } from "./errorHandler";
import { env } from "./env.client";

// const BASE_URL = "http://localhost:3000/api/v1/";
// const BASE_URL = "https://calm-cyan-bullfrog-tie.cyclic.app/api/v1/";
// const BASE_URL = "http://62.171.175.75:3000/api/v1/";

export const authApi = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export const privateAuthApi = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

privateAuthApi.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<ILoginResponse>("auth/refresh");
  return response.data;
};

declare module 'axios' {
  export interface AxiosRequestConfig {
    raw?: boolean
    silent?: boolean
  }
}


// this interceptor is used to handle all success ajax request
// we use this to check if status code is 200 (success), if not, we throw an HttpError
// to our error handler take place.
function responseHandler(response: AxiosResponse<any>) {
  // const originalRequest = response?.config
  // if (originalRequest.raw) {
  //   return response
  // }
  if (response.status == 200 || response.status == 201) {
    const data = response?.data
    if (!data) {
      throw new HttpError('No data!')
    }
    return response;
  }
  throw new HttpError('Invalid status code!')
}

async function responseErrorHandler(error: any) {
  const originalRequest = error?.config;

  if (originalRequest.raw) {
    return error
  }
  // the code of this function was written in above section.
  return  await httpErrorHandler(error)
}



//register interceptor like this
authApi.interceptors.response.use(responseHandler, responseErrorHandler);
privateAuthApi.interceptors.response.use(responseHandler, responseErrorHandler);


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
// privateAuthApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const errStatus = error?.response?.status;
//     if (errStatus === 403 && !originalRequest.sent) {
//       originalRequest.sent = true;
//       const newAccessToken = await refreshAccessTokenFn();
//       originalRequest.headers[
//         "Authorization"
//       ] = `Bearer ${newAccessToken.token}`;
//       return authApi(originalRequest);
//     }
//     if (errStatus === 403) {
//       document.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
