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
export const updateReadNotification = async (
  accessToken: string | undefined,
  id: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<
    IPaginatedResponse<GenericResponse>
  >(`notification/unread/${id}`);
  return response.data.results;
};
