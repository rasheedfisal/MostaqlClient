import { IPaginatedResponse } from "../../typings";
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
