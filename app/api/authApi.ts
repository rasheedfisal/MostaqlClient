import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  ISysUserResponse,
  IUser,
} from "../../typings";
import { authApi, privateAuthApi } from "./axios";

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>("auth/signup", user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<ILoginResponse>("auth/signin", user);
  return response.data;
};

export const verifyEmailFn = async (verificationCode: string) => {
  const response = await authApi.get<GenericResponse>(
    `auth/verifyemail/${verificationCode}`
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await privateAuthApi.get<GenericResponse>("auth/signout");
  return response.data;
};

export const getMeFn = async (accessToken: string | undefined) => {
  //
  // const [_, accessToken] = queryKey;
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // };
  // const headers = { Authorization: `Bearer ${accessToken}` };
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IUser>("users/me");
  return response.data;
};
