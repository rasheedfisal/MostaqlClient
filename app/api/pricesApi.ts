import { ICreateUpdatePrice } from "../(dashboard)/prices/add/page";
import { IUpdatePrice } from "../(dashboard)/prices/[priceId]/page";
import { GenericResponse, ICategory, IPriceRange } from "../../typings";
import { privateAuthApi } from "./axios";

export const getAllPricesFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPriceRange[]>("pricerange");
  return response.data;
};

export const getPriceFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPriceRange>(`pricerange/${id}`);
  return response.data;
};

export const createPriceFn = async (
  price: ICreateUpdatePrice,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IPriceRange>(`pricerange`, price);
  return response.data;
};

export const updatePriceFn = async ({
  id,
  price,
  accessToken,
}: {
  id: string;
  price: IUpdatePrice;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<IPriceRange>(
    `pricerange/${id}`,
    price
  );
  return response.data;
};

export const deletePriceFn = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.delete<GenericResponse>(
    `pricerange/${id}`
  );
  return response.data;
};
