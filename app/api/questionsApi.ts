import { ICreateQuestion } from "../(dashboard)/questions/add/page";
import { IUpdateQuestion } from "../(dashboard)/questions/[qId]/page";
import { GenericResponse } from "../../typings";
import { privateAuthApi } from "./axios";

interface ICommonQuestion {
  id: string;
  question: string;
  answer: string;
  order_no: number;
  createdAt: Date;
}

export const getAllQuestionsFn = async (accessToken: string | undefined) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICommonQuestion[]>("questions");
  return response.data;
};

export const getQuestionFn = async (id: string, accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICommonQuestion>(`questions/${id}`);
  return response.data;
};

export const createQuestionFn = async (
  data: ICreateQuestion,
  accessToken: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<ICommonQuestion>(
    `questions`,
    data
  );
  return response.data;
};

export const updateQuestionFn = async ({
  id,
  data,
  accessToken,
}: {
  id: string;
  data: IUpdateQuestion;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<ICommonQuestion>(
    `questions/${id}`,
    data
  );
  return response.data;
};

export const deleteQuestionFn = async ({
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
    `questions/${id}`
  );
  return response.data;
};
