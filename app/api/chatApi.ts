import { LoginInput } from "../(auth)/login/page";
import { RegisterInput } from "../(auth)/register/page";
import {
  GenericResponse,
  ILoginResponse,
  IPaginatedResponse,
  ISysUser,
  ISysUserResponse,
  IUser,
} from "../../typings";
import { privateAuthApi } from "./axios";

type chatUser = Omit<ISysUser, "Role" | "phone">;

interface LastChat {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt: Date;
  sender_name: string;
  sender_email: string;
  sender_img: string | null;
  reciever_name: string;
  reciever_email: string;
  reciever_img: string | null;
}

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
  createdAt: Date;
}

export type ICreateRequest = Pick<IChat, "receiver_id" | "message">;
export type IChatRequest = Pick<IChat, "receiver_id">;

export const createChatFn = async (
  accessToken: string | undefined,
  chat: ICreateRequest
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IChat>("conversations", chat);
  return response.data;
};
// export const getAllUsersChatFn = async (
//   accessToken: string | undefined,
//   chat: IChatRequest,
//   pageNo: number,
//   recordSize: number
// ) => {
//   privateAuthApi.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${accessToken}`;
//   const response = await privateAuthApi.post<IPaginatedResponse<IChat>>(
//     `conversations/chat?page=${pageNo}&size=${recordSize}`,
//     chat
//   );
//   return response.data;
// };
export const getAllUsersChatFn = async (
  accessToken: string | undefined,
  chat: IChatRequest,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<IPaginatedResponse<IChat>>(
    `conversations/chat?page=${pageNo}&size=${recordSize}`,
    chat
  );
  return response.data.results;
};
