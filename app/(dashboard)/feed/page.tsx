"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAllAccountFeedRequestsFn,
  approveRejectAccountFeedRequestFn,
  transferAccountFeedMoneyFn,
} from "../../api/paymentApi";
import useAccessToken from "../../../hooks/useAccessToken";
import TableLoader from "../../../components/TableLoader";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import RequestStatusBadge from "../../../components/RequestStatusBadge";
import ChatButton from "../../../components/ChatButton";
import { USDollar } from "../../api/currencyFormatter";
const page = () => {
  const [pages, setPages] = useState(0);
  const [records, setRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const {
    isLoading,
    isFetching,
    isPreviousData,
    data: items,
  } = useQuery(
    ["feedrequests", pageNumber, pageSize],
    () => getAllAccountFeedRequestsFn(token, pageNumber, pageSize),
    {
      select: (data) => data,
      retry: 1,
      keepPreviousData: true,
      onSuccess: (e) => {
        if (e?.totalItems) {
          setRecords(e.totalItems);
        }
        if (e?.currentPage) {
          setPageNumber(e.currentPage);
        }
        if (e?.totalPages) {
          setPages(e.totalPages);
        }
      },
      onError: (error) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  useUpdateEffect(() => {
    if (
      !isPreviousData &&
      items?.results.length !== undefined &&
      items?.results.length > 0
    ) {
      queryClient.prefetchQuery(["feedrequests", pageNumber, pageSize], () =>
        getAllAccountFeedRequestsFn(token, pageNumber, pageSize)
      );
    }
  }, [items, pageNumber, pageSize, isPreviousData, queryClient]);

  const { isLoading: isAccepting, mutate: approveorreject } = useMutation(
    ({
      id,
      accessToken,
      accepted,
    }: {
      id: string;
      accessToken: string;
      accepted: boolean;
    }) => approveRejectAccountFeedRequestFn({ id, accessToken, accepted }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feedrequests"]);
        toast.success("Status Changed successfully");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading: isTransfering, mutate: transferMoney } = useMutation(
    ({
      id,
      accessToken,
      accepted,
    }: {
      id: string;
      accessToken: string;
      accepted: boolean;
    }) => transferAccountFeedMoneyFn({ id, accessToken, accepted }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feedrequests"]);
        toast.success("Money Transfered successfully");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  const handleApproveOrReject = (id: string, accepted: boolean) => {
    if (
      confirm(
        `are you sure you want to ${
          accepted ? "approve" : "reject"
        } this request?`
      )
    ) {
      approveorreject({
        id: id,
        accessToken: token,
        accepted,
      });
    }
  };
  const handleTransfer = (id: string, accepted: boolean) => {
    if (confirm(`are you sure you want to transfer this amount?`)) {
      transferMoney({
        id: id,
        accessToken: token,
        accepted,
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Manage Account Feed Requests</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">Request List</h3>
              </div>
              {/* <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/users/add"
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div> */}
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <div className="relative">
              {(isFetching || isAccepting || isTransfering) && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Account
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Amount
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      attachment
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Status
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items?.results.map((item) => (
                    <tr key={item.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left  ">
                        <div className="flex items-center text-sm">
                          <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src={
                                item.User.imgPath?.replace("\\", "/") ??
                                "noImg.jpg"
                              }
                              alt="avatar"
                              loading="lazy"
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {item.User.fullname}
                            </p>
                            <p className="text-xs">
                              {item.User.Role?.role_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <span className="font-semibold">
                          Credit:{" "}
                          {USDollar.format(item.User.wallet?.credit ?? 0)}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {USDollar.format(item.amount)}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.attachment ? (
                          <a
                            href={item.attachment}
                            className="underline text-blue-700 text-sm cursor-pointer"
                            target="_blank"
                          >
                            view
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <RequestStatusBadge accept={item.accepted} />
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <div className="flex">
                          <ChatButton
                            user={item.User}
                            color="blue"
                            who="User"
                          />
                          {item.accepted ? (
                            !item.is_transfered && (
                              <div
                                onClick={() => handleTransfer(item.id!, true)}
                                className="bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                              >
                                Withdraw Money
                              </div>
                            )
                          ) : (
                            <div
                              onClick={() =>
                                handleApproveOrReject(item.id!, true)
                              }
                              className="bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                            >
                              Approve
                            </div>
                          )}
                          {!item.is_transfered && (
                            <div
                              onClick={() =>
                                handleApproveOrReject(item.id!, false)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                            >
                              Reject
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-1 items-center justify-evenly mt-5">
              <div>
                <p className="text-sm ">
                  Showing
                  <span className="font-medium pr-1 pl-1">1</span>
                  to
                  <span className="font-medium pr-1 pl-1">10</span>
                  of
                  <span className="font-medium pr-1 pl-1">{records}</span>
                  results
                </p>
              </div>
              <div>
                {!isLoading && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={(e) => setPageNumber(e.selected + 1)}
                    pageRangeDisplayed={10}
                    pageCount={pages}
                    previousLabel="< previous"
                    renderOnZeroPageCount={undefined}
                    containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    pageLinkClassName="hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
                    previousLinkClassName="inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    nextLinkClassName="inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    activeLinkClassName="z-10 inline-flex items-center border border-primary bg-primary-lighter px-4 py-2 text-sm font-medium text-primary focus:z-20"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
