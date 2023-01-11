import { ICreateSubCat } from "../(dashboard)/categories/sub/add/[catId]/page";
import { IUpdateSubCat } from "../(dashboard)/categories/sub/[catId]/[subId]/page";
import { GenericResponse, ICategory } from "../../typings";
import { privateAuthApi } from "./axios";

interface ISubCategory {
  id: string;
  name: string;
}

export const getAllCategoriesFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICategory[]>("category");
  return response.data;
};
export const getAllSubCategoriesFn = async (
  accessToken: string | undefined,
  catId: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ISubCategory[]>(
    `category/subcat/${catId}`
  );
  return response.data;
};

export const getCategoryFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICategory>(`category/${id}`);
  return response.data;
};
export const getSubCategoryFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ISubCategory>(
    `category/subcat/get/${id}`
  );
  return response.data;
};

export const createCategoryFn = async (
  formData: FormData,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<ICategory>(`category`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const createSubCategoryFn = async (
  catId: string,
  data: ICreateSubCat,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<ISubCategory>(
    `category/subcat/${catId}`,
    data
  );
  return response.data;
};

export const updateCategoryFn = async ({
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
  const response = await privateAuthApi.put<ICategory>(
    `category/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const updateSubCategoryFn = async ({
  id,
  data,
  accessToken,
}: {
  id: string;
  data: IUpdateSubCat;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<ISubCategory>(
    `category/subcat/update/${id}`,
    data
  );
  return response.data;
};

export const deleteCategoryFn = async ({
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
    `category/${id}`
  );
  return response.data;
};

export const deleteSubCategoryFn = async ({
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
    `category/subcat/delete/${id}`
  );
  return response.data;
};
