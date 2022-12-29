import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  IPaginatedResponse,
  IPermission,
  IRole,
} from "../../typings";
import { privateAuthApi } from "./axios";

interface RolePermissions {
  permissions: IPermission[];
}

type RolesList = Omit<IRole, "permissions">;
type Role = Pick<IRole, "role_name" | "role_description">;

export const getAllRolesFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<RolesList>>(
    "roles?page=1&size=10"
  );
  return response.data;
};

export const getRoleFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IRole>(`roles/${id}`);
  return response.data;
};

export const getRolePermissionFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<RolePermissions>(
    `roles/permissions/${id}`
  );
  return response.data;
};
export const getAllPermissionFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPermission[]>(`permissions`);
  return response.data;
};

export const createRoleFn = async (data: Role, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<RolesList>(`roles`, data);
  return response.data;
};

export const updateRoleFn = async ({
  id,
  data,
  accessToken,
}: {
  id: string;
  data: Role;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<IRole>(`users/${id}`, data);
  return response.data;
};

export const deleteRoleFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(`roles/${id}`);
  return response.data;
};
