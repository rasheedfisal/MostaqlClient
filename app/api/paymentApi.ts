import { GenericResponse, IPaginatedResponse, ISysUser } from "../../typings";
import { privateAuthApi } from "./axios";

interface IFeed {
  id: string;
  amount: number;
  attachment: string;
  accepted: boolean | null;
  createdAt: Date;
  User: ISysUser;
}
interface IWithdraw {
  id: string;
  amount: number;
  attachment: string;
  accepted: boolean | null;
  type: string;
  createdAt: Date;
  User: ISysUser;
  paypal: IPaypal[];
  creditcard: ICreditCard[];
}

interface IPaypal {
  email: string;
}
interface ICreditCard {
  name: string;
  card_number: string;
  expiration: string;
  security_code: string;
}

export const getAllAccountFeedRequestsFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<IFeed>>(
    `payments/feed?page=${pageNo}&size=${recordSize}`
  );
  return response.data;
};

export const approveRejectAccountFeedRequestFn = async ({
  id,
  accessToken,
  accepted,
}: {
  id: string;
  accessToken: string;
  accepted: boolean;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `payments/feed/${id}`,
    { accepted }
  );
  return response.data;
};

export const getAllWithdrawRequestsFn = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IPaginatedResponse<IWithdraw>>(
    `payments/withdraw?page=${pageNo}&size=${recordSize}`
  );
  return response.data;
};

export const approveRejectWithdrawRequestFn = async ({
  id,
  accessToken,
  accepted,
}: {
  id: string;
  accessToken: string;
  accepted: boolean;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `payments/withdraw/${id}`,
    { accepted }
  );
  return response.data;
};
