import {
  GenericResponse,
  IPaginatedResponse,
  IPermission,
  IRole,
} from "../../typings";
import { privateAuthApi } from "./axios";
import { ICreateUpdateRole } from "../(dashboard)/roles/add/page";
import { IUpdateRole } from "../(dashboard)/roles/[roleId]/page";

interface RolePermissions {
  permissions: IPermission[];
}

export interface AddRolePermissions {
  permissions: string[];
}

interface Response {
  message: string;
}

type RolesList = Omit<IRole, "permissions">;
// type Role = Pick<IRole, "role_name" | "role_description">;

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

export const createRoleFn = async (
  data: ICreateUpdateRole,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<RolesList>(`roles`, data);
  return response.data;
};
export const addPermissionsToRoleFn = async (
  data: AddRolePermissions,
  roleId: string,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<Response>(
    `roles/permissions/${roleId}`,
    data
  );
  return response.data;
};

export const updateRoleFn = async ({
  id,
  data,
  accessToken,
}: {
  id: string;
  data: IUpdateRole;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<IRole>(`roles/${id}`, data);
  return response.data;
};

export const deleteRoleFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(`roles/${id}`);
  return response.data;
};
