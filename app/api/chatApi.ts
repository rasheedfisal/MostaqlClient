import { IPaginatedResponse, ISysUser } from "../../typings";
import { privateAuthApi } from "./axios";

interface LastChat {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: string;
  createdAt: Date;
  sender_name: string;
  sender_email: string;
  sender_img: string | null;
  receiver_name: string;
  receiver_email: string;
  receiver_img: string | null;
}

export type ActiveUser = {
  userId: string;
  socketId: string;
};

export const getAllChatUsersFn = async (
  accessToken: string | undefined,
  pageNo: number,
  searchTerm: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IPaginatedResponse<ISysUser>>(
    `users/userschat?page=${pageNo}&size=10&query=${searchTerm}`
  );
  return response.data.results;
};

export const getAllLastChatUsersFn = async (
  accessToken: string | undefined,
  pageNo: number,
  searchTerm: string
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IPaginatedResponse<LastChat>>(
    `conversations/lastchats?page=${pageNo}&size=10&search=${searchTerm}`
  );
  return response.data.results;
};

export interface IChat {
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: string;
  createdAt: Date;
  fileUrl?: string;
}

export type ICreateRequest = Pick<
  IChat,
  "receiver_id" | "message" | "message_type"
>;
export type IChatRequest = Pick<IChat, "receiver_id">;

export const createChatFn = async (
  accessToken: string | undefined,
  chat: FormData
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IChat>("conversations", chat, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getAllUsersChatFn = async (
  accessToken: string | undefined,
  chat: IChatRequest,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;

  if (!!!chat.receiver_id) {
    return;
  }

  const response = await privateAuthApi.post<IPaginatedResponse<IChat>>(
    `conversations/chat?page=${pageNo}&size=${recordSize}`,
    chat
  );
  return response.data.results;
};
