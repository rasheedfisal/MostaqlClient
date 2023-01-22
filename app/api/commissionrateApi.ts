import { ICreateRate } from "../(dashboard)/rate/add/page";
import { IUpdateRate } from "../(dashboard)/rate/[rateId]/page";
import {
  GenericResponse,
  ICategory,
  IPaginatedResponse,
  IPriceRange,
} from "../../typings";
import { privateAuthApi } from "./axios";

interface IRate {
  id: string;
  ratepercent: number;
  iscurrent: boolean;
}

export const getAllCommissionRatesFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<IRate>>(
    `rate?page=${pageNo}&size=${recordSize}`
  );
  return response.data;
};

export const getRateFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IRate>(`rate/${id}`);
  return response.data;
};

export const createRateFn = async (rate: ICreateRate, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IRate>(`rate`, rate);
  return response.data;
};

export const updateRateFn = async ({
  id,
  rate,
  accessToken,
}: {
  id: string;
  rate: IUpdateRate;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<IRate>(`rate/${id}`, rate);
  return response.data;
};

export const deleteRateFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(`rate/${id}`);
  return response.data;
};
