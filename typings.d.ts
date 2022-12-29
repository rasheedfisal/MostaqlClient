export interface IUser {
  // id: string;
  fullname: string;
  email: string;
  imgPath: string;
  permissions: string[];
}
export interface ISysUser {
  id?: string;
  fullname: string;
  email: string;
  phone: string;
  imgPath: string;
  is_active: boolean;
  Role?: IRole;
}
export interface IRole {
  id: string;
  role_name: string;
  role_description: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: IPermission[];
}
export interface IPermission {
  id: string;
  perm_name: string;
  perm_description: string;
  createdAt: Date;
  updatedAt: Date;
  RolePermission?: IRolePermission;
}
export interface IRolePermission {
  id: string;
  role_id: string;
  perm_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISysUserResponse {
  totalItems: Number;
  results: ISysUser[];
}

export interface IToken {
  token: string;
}
export interface IPaginatedResponse<T> {
  totalItems: number;
  results: T[];
  totalPages: number;
  currentPage: number;
}
export interface GenericResponse {
  status: boolean;
  message: string;
}

export interface ILoginResponse {
  success: boolean;
  token: string;
}

export interface IUserResponse {
  status: boolean;
  data: {
    user: IUser;
  };
}
