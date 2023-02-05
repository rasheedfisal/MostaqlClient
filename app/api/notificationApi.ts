import { ICreateNotify } from "../(dashboard)/notifications/add/page";
import { GenericResponse, IPaginatedResponse } from "../../typings";
import { privateAuthApi } from "./axios";

interface INotification {
  id: string;
  title: string;
  description: string;
  type: string;
  sender_id: string;
  createdAt: Date;
  email: string;
  fullname: string;
  imgPath: string | null;
  role_name: string;
  read: boolean;
  receiver_id: string | null;
}

export type senderNotification = Pick<
  INotification,
  "id" | "title" | "description" | "createdAt" | "sender_id"
>;

export const getAllUserNotitifcationsFn = async (
  accessToken: string | undefined,
  pageNo: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<INotification>>(
    `notification?page=${pageNo}&size=10`
  );
  return response.data.results;
};
export const getAllSenderNotitifcationsFn = async (
  accessToken: string | undefined,
  pageNo: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<
    IPaginatedResponse<senderNotification>
  >(`notification/user?page=${pageNo}&size=10`);
  return response.data;
};
export const createNotitifcationFn = async ({
  notify,
  accessToken,
}: {
  notify: ICreateNotify;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<senderNotification>(
    `notification`,
    notify
  );
  return response.data;
};
export const updateReadNotification = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<
    IPaginatedResponse<GenericResponse>
  >(`notification/unread/${id}`);
  return response.data;
};

export const deleteNotificationFn = async ({
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
    `notification/${id}`
  );
  return response.data;
};
