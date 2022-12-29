import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  IPaginatedResponse,
  ISysUser,
  ISysUserResponse,
  IUser,
} from "../../typings";
import { privateAuthApi } from "./axios";

export const getAllUsersFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<ISysUser>>(
    "users?page=1&size=10"
  );
  return response.data;
};

export const getUserFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ISysUser>(`users/${id}`);
  return response.data;
};

export const createUserFn = async (formData: FormData, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<ISysUser>(`users`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateUserFn = async ({
  id,
  formData,
  accessToken,
}: {
  id: string;
  formData: FormData;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<ISysUser>(`users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteUserFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(`users/${id}`);
  return response.data;
};
