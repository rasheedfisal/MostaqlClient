import {
  GenericResponse,
  IPaginatedResponse,
  ISysUser,
  IWallet,
} from "../../typings";
import { privateAuthApi } from "./axios";

interface ISupportBox {
  id: string;
  type: string;
  description: string;
  user_id: string;
  is_resolved: boolean;
  createdAt: Date;
  User: ISysUser;
}

export const getAllSupportBoxsFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<ISupportBox>>(
    `support?page=${pageNo}&size=${recordSize}`
  );
  return response.data;
};

export const resolveSupportBoxFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(`support/${id}`);
  return response.data;
};
