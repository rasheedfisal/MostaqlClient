import { GenericResponse, ICategory } from "../../typings";
import { privateAuthApi } from "./axios";

export const getAllCategoriesFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICategory[]>("category");
  return response.data;
};

export const getCategoryFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICategory>(`category/${id}`);
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
