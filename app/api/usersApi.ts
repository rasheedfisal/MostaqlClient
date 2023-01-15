import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  IPaginatedResponse,
  IRole,
  ISysUser,
  ISysUserResponse,
  IUser,
} from "../../typings";
import { privateAuthApi } from "./axios";

interface UserCredentials {
  id?: string;
  fullname: string;
  email: string;
  phone: string;
  imgPath: string;
  is_active: boolean;
  CreatedAt?: Date;
  Role?: IRole;
  usercredentials: {
    id: string;
    attachments: string;
    is_authorized: boolean;
  };
}

export const getAllUsersFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<ISysUser>>(
    `users?page=${pageNo}&size=${recordSize}`
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

export const deleteUserFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(`users/${id}`);
  return response.data;
};

export const lockUnlockUserFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `users/lockunlock/${id}`
  );
  return response.data;
};

export const getAllCredentialUsersFn = async (
  accessToken: string,
  page: number,
  size: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<
    IPaginatedResponse<UserCredentials>
  >(`users/credentials?page=${page}&size=${size}`);
  return response.data;
};

export const authorizeUnAuthorizeUserFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `users/credentials/${id}`
  );
  return response.data;
};
