import { IUpdsertContact } from "../(dashboard)/contact/page";
import { ICard } from "../(dashboard)/creditcards/page";
import { IUpdsertPaypal } from "../(dashboard)/paypal/page";
import { IUpdsertPrivacy } from "../(dashboard)/privacy/page";
import { IUpdsertWithdraw } from "../(dashboard)/withdraw/page";
import { GenericResponse } from "../../typings";
import { authApi, privateAuthApi } from "./axios";

interface IContact {
  website_link: string;
  phone: string;
  email: string;
}
interface IPaypal {
  email: string;
}
interface IPrivacy {
  description: string;
}
interface IWithdraw {
  amount: number;
}

interface IStatistics {
  statistics: {
    usersCount: number;
    currentCommision: number;
    ongoingProjects: number;
    openProjects: number;
    completedProjects: number;
    closedProjects: number;
    closedProjectRequests: number;
    completedProjectRequests: number;
    accountFeedRequests: number;
    moneyWithdrawalRequests: number;
    earnings: number;
  };
  userRoles: [
    {
      count: number;
      role_name: string;
    }
  ];
  projectCategory: [
    {
      count: number;
      cat_name: string;
    }
  ];
  earningPerMonth: [
    {
      earning_per_month: number;
      month: number;
      year: number;
    }
  ];
  authorizedUsers: x[];
}

type x = {
  count: number;
  is_authorized: number;
};

export const getContactFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await authApi.get<IContact>(`site/contact`);
  return response.data;
};
export const updateContactFn = async ({
  data,
  accessToken,
}: {
  data: IUpdsertContact;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<GenericResponse>(
    `siteadmin/contact`,
    data
  );
  return response.data;
};

export const getPrivacyFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await authApi.get<IPrivacy>(`site/privacy`);
  return response.data;
};
export const updatePrivacyFn = async ({
  data,
  accessToken,
}: {
  data: IUpdsertPrivacy;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<GenericResponse>(
    `siteadmin/privacy`,
    data
  );
  return response.data;
};

export const getWithdrawbleFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await authApi.get<IWithdraw>(`site/withdraw`);
  return response.data;
};
export const updateWithdrawbleFn = async ({
  data,
  accessToken,
}: {
  data: IUpdsertWithdraw;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<GenericResponse>(
    `siteadmin/withdraw`,
    data
  );
  return response.data;
};

export const getPaypalFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await authApi.get<IPaypal>(`site/paypal`);
  return response.data;
};
export const updatePaypalFn = async ({
  data,
  accessToken,
}: {
  data: IUpdsertPaypal;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<GenericResponse>(
    `siteadmin/paypal`,
    data
  );
  return response.data;
};

export const getCreditCardFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<ICard>(`siteadmin/creditcard`);
  return response.data;
};
export const updateCreditCardFn = async ({
  data,
  accessToken,
}: {
  data: ICard;
  accessToken: string;
}) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.post<GenericResponse>(
    `siteadmin/creditcard`,
    data
  );
  return response.data;
};

export const getDashboardStatisticsFn = async (accessToken: string) => {
  privateAuthApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  const response = await privateAuthApi.get<IStatistics>(
    `siteadmin/statistics`
  );
  return response.data;
};
