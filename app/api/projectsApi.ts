import {
  GenericResponse,
  ICategory,
  IPaginatedResponse,
  IPermission,
  IPriceRange,
  IProjectStatus,
  IRole,
  ISysUser,
  IUser,
} from "../../typings";
import { privateAuthApi } from "./axios";
import { ICreateUpdateRole } from "../(dashboard)/roles/add/page";

interface RolePermissions {
  permissions: IPermission[];
}

export interface AddRolePermissions {
  permissions: string[];
}

interface Response {
  message: string;
}

type owner = {
  fullname: string;
  avatar: string;
};
type Category = Pick<ICategory, "cat_name" | "cat_img">;
type PriceRange = Pick<IPriceRange, "range_name">;
type ProjStatus = Pick<IProjectStatus, "stat_name">;
type client = Omit<ISysUser, "Role" | "is_active">;

type ProjectCat = {
  name: string;
  Category: Category;
};
interface clientProfile extends client {
  userprofiles: {
    about_user: string;
    specialization: string;
  };
}

interface ProjectList {
  id: string;
  proj_title: string;
  proj_description: string;
  proj_period: number;
  CreatedAt: number;
  attatchment_file: string;
  OffersCount: number;
  owner: owner;
  SubCategory: ProjectCat;
  PriceRange: PriceRange;
  ProjStatus: ProjStatus;
}

interface OfferList {
  id: string;
  price: string;
  days_to_deliver: string;
  message_desc: string;
  pdf_url: string;
  createdAt: Date;
  client: clientProfile;
}

export const getAllProjectsFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number,
  searchQuery: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<ProjectList>>(
    `project/admin?page=${pageNo}&size=${recordSize}&search=${searchQuery}`
  );
  return response.data;
};

export const getProjectOffersFn = async (
  accessToken: string | undefined,
  projectId: string,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<OfferList>>(
    `offer/project/${projectId}?page=${pageNo}&size=${recordSize}`
  );
  return response.data;
};
