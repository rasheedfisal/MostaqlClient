import { ForgetInput } from "../(auth)/forget/page";
import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  ISysUserResponse,
  IUser,
} from "../../typings";
import { authApi, privateAuthApi } from "./axios";

export interface IResetPassword {
  userId: string;
  resetId: string;
  password: string;
}

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>("auth/signup", user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<ILoginResponse>(
    "auth/dashboard_signin",
    user
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await privateAuthApi.post<GenericResponse>("auth/signout");
  return response.data;
};

export const getMeFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IUser>("users/me");
  return response.data;
};

export const verifyEmailFn = async (email: ForgetInput) => {
  const response = await authApi.post<GenericResponse>("reset", email);
  return response.data;
};

export const resetPasswordFn = async (reset: IResetPassword) => {
  const response = await authApi.post<GenericResponse>(`reset/user`, reset);
  return response.data;
};
