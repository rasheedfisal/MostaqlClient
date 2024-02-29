"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getCloseProjectRequestFn,
  approveRejectProjectCancellationRequestFn,
  owner,
} from "../../api/projectsApi";
import useAccessToken from "../../../hooks/useAccessToken";
import TableLoader from "../../../components/TableLoader";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import CancelRequestBadge from "../../../components/CancelRequestBadge";
import { ISysUser } from "../../../typings";
import { useStateContext } from "../../../context/AppConext";
import ChatButton from "../../../components/ChatButton";
const page = () => {
  const [pages, setPages] = useState(0);
  const [records, setRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const token = useAccessToken();
  const stateContext = useStateContext();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isFetching,
    isPlaceholderData,
    data: items,
    isSuccess,
    error
  } = useQuery(
    {
      queryKey: ["projectcancellation", pageNumber, pageSize],
      queryFn: () => getCloseProjectRequestFn(token, pageNumber, pageSize),
      select: (data) => data,
      retry: 1,
      placeholderData: keepPreviousData
    }
  );

  useUpdateEffect(() => {
    if (
      !isPlaceholderData &&
      items?.results.length !== undefined &&
      items?.results.length > 0
    ) {
      queryClient.prefetchQuery(
       { queryKey: ["projectcancellation", pageNumber, pageSize],
        queryFn: () => getCloseProjectRequestFn(token, pageNumber, pageSize)}
      );
    }
  }, [items, pageNumber, pageSize, isPlaceholderData, queryClient]);

  const { isPending: isAccepting, mutate: approveorreject } = useMutation(
    
    {
      mutationFn: ({
      id,
      accessToken,
      accepted,
    }: {
      id: string;
      accessToken: string;
      accepted: boolean;
    }) =>
      approveRejectProjectCancellationRequestFn({ id, accessToken, accepted }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["projectcancellation"]});
        toast.success("Status Changed successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
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
  const getOwner = (user: owner): ISysUser => {
    const setUser: ISysUser = {
      id: user.id,
      fullname: user.fullname,
      email: user.email!,
      imgPath: user.avatar!,
      is_active: user.is_active!,
      phone: user.phone!,
    };
    return setUser;
  };


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess) {
    if (items?.totalItems) {
          setRecords(items.totalItems);
        }
        if (items?.currentPage) {
          setPageNumber(items.currentPage);
        }
        if (items?.totalPages) {
          setPages(items.totalPages);
        }
  }
  if (error !== null) {
    toast.error(error.message, {position: "top-right"})
  }
  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">
          Manage Project Cancellation Requests
        </h1>
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
              {(isFetching || isAccepting) && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Reason
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Project
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
                                item.ownerProject.owner.avatar?.replace(
                                  "\\",
                                  "/"
                                ) ?? "noImg.jpg"
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
                              {item.ownerProject.owner.fullname}
                            </p>
                            <p className="text-xs">Owner</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {item.reason}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.ownerProject.proj_title}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <CancelRequestBadge accept={item.accepted} />
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <div className="flex">
                          {item.accepted === null ? (
                            <div
                              onClick={() =>
                                handleApproveOrReject(
                                  item.ownerProject.id!,
                                  true
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                            >
                              Cancel Project
                            </div>
                          ) : null}
                          <ChatButton
                            user={getOwner(item.ownerProject.owner)}
                            color="blue"
                            who="Owner"
                          />
                          {/* <div
                            onClick={() =>
                              setCurrentChatUser(item.ownerProject.owner)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                          >
                            {chatInitial ? "wait..." : "Chat with Owner"}
                          </div> */}
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
