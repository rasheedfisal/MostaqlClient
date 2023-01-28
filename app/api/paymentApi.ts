import {
  GenericResponse,
  IPaginatedResponse,
  ISysUser,
  IWallet,
} from "../../typings";
import { privateAuthApi } from "./axios";

interface IFeed {
  id: string;
  amount: number;
  attachment: string;
  accepted: boolean | null;
  is_transfered: boolean;
  createdAt: Date;
  User: ISysUser;
}
interface IWithdraw {
  id: string;
  amount: number;
  attachment: string;
  accepted: boolean | null;
  is_transfered: boolean;
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

export interface IOwner {
  id: string;
  email: string;
  fullname: string;
  avatar: string;
  wallet: IWallet;
}

interface ICompletedProject {
  id: string;
  approved: boolean | null;
  is_transfered: boolean;
  createdAt: Date;
  ownerProject: {
    id: string;
    proj_title: string;
    proj_period: number;
    owner: IOwner;
  };
  winning_offer: {
    id: string;
    price: number;
    client: {
      id: string;
      email: string;
      fullname: string;
      avatar: string;
      wallet: IWallet;
    };
    commissionRate: {
      ratepercent: number;
    };
  };
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
export const transferAccountFeedMoneyFn = async ({
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
    `payments/feed/transfer/${id}`,
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

export const transferWithdrawalMoneyFn = async ({
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
    `payments/withdraw/transfer/${id}`,
    { accepted }
  );
  return response.data;
};

export const getAllCompletedProjectRequest = async (
  accessToken: string | undefined,
  pageNo: number,
  recordSize: number
) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<
    IPaginatedResponse<ICompletedProject>
  >(`project/request/completed?page=${pageNo}&size=${recordSize}`);
  return response.data;
};

export const approveCompleteProjectRequestFn = async ({
  id,
  accessToken,
  offerId,
}: {
  id: string;
  accessToken: string;
  offerId: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `project/completed/${id}`,
    { offer_id: offerId }
  );
  return response.data;
};
export const transferCompletedProjectMoneyFn = async ({
  id,
  accessToken,
  offerId,
}: {
  id: string;
  accessToken: string;
  offerId: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.put<GenericResponse>(
    `project/completed/transfer/${id}`,
    { offer_id: offerId }
  );
  return response.data;
};
