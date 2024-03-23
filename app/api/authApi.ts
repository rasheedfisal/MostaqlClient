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
  id: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>("auth/signup", user);
  if (response.status !== 200) {
    throw new Error(response?.data?.message);
  }
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
  return response;
};

export const getMeFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IUser>("users/me");
  return response.data;
};

export const forgetPasswordFn = async (email: ForgetInput) => {
  const response = await authApi.post<GenericResponse>(
    "auth/forget-password",
    email
  );
  return response.data;
};

export const resetPasswordFn = async (reset: IResetPassword) => {
  const response = await authApi.post<GenericResponse>(
    `auth/reset-password`,
    reset
  );
  return response.data;
};
