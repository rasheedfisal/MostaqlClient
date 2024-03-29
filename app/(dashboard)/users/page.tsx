"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteUserFn,
  getAllUsersFn,
  lockUnlockUserFn,
} from "../../api/usersApi";
import useAccessToken from "../../../hooks/useAccessToken";
import ActiveStatusBadge from "../../../components/ActiveStatusBadge";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import TableLoader from "../../../components/TableLoader";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import { PowerIcon } from "@heroicons/react/24/solid";
const ManageUsers = () => {
  const [pages, setPages] = useState(0);
  const [records, setRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const {
    isLoading,
    isFetching,
    isPlaceholderData,
    data: users,
    isSuccess,
    error
  } = useQuery(
    {
      queryKey: ["users", pageNumber, pageSize],
      queryFn: () => getAllUsersFn(token, pageNumber, pageSize),
      select: (data) => data,
      retry: 1,
      placeholderData: keepPreviousData
    }
  );

  useUpdateEffect(() => {
    if (
      !isPlaceholderData &&
      users?.results.length !== undefined &&
      users?.results.length > 0
    ) {
      queryClient.prefetchQuery({queryKey:["users", pageNumber, pageSize], queryFn: () =>
        getAllUsersFn(token, pageNumber, pageSize)}
      );
    }
  }, [users, pageNumber, pageSize, isPlaceholderData, queryClient]);

  const { isPending: isDeleteing, mutate: deleteUser } = useMutation(
    {
      mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
        deleteUserFn({ id, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["users"]});
        toast.success("User deleted successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );
  const { isPending: isLocking, mutate: lockUnlockUser } = useMutation(
    {
      mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
        lockUnlockUserFn({ id, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["users"]});
        toast.success("User Status Changed successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );
  const handleDelete = (id: string) => {
    if (confirm("are you sure you want to delete?")) {
      deleteUser({
        id: id,
        accessToken: token,
      });
    }
  };

  const handleLockUnlock = (id: string, isActive: boolean) => {
    if (confirm(`are you sure you want to ${isActive ? "Lock" : "UnLock"}?`)) {
      lockUnlockUser({
        id: id,
        accessToken: token,
      });
    }
  };

  useUpdateEffect(() => {
    if (isSuccess) {
      if (users?.totalItems) {
          setRecords(users.totalItems);
        }
        if (users?.currentPage) {
          setPageNumber(users.currentPage);
        }
        if (users?.totalPages) {
          setPages(users.totalPages);
        }
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])

  

  if (isLoading) {
    return <p>Loading...</p>;
  }


  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">User List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/users/add"
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <div className="relative">
              {(isDeleteing || isFetching || isLocking) && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Email
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Phone
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
                  {users?.results.map((user) => (
                    <tr key={user.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left  ">
                        <div className="flex items-center text-sm">
                          <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src={
                                user.imgPath?.replace("\\", "/") ?? "noImg.jpg"
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
                            <p className="font-semibold">{user.fullname}</p>
                            <p className="text-xs">{user.Role?.role_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {user.email}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {user.phone}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <ActiveStatusBadge isActive={user.is_active} />
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <div className="flex">
                          <Link
                            href={`/users/${user.id}`}
                            className="w-4 mr-2 mt-1 transform hover:text-purple-700 hover:scale-110"
                          >
                            <EditIcon />
                          </Link>
                          <div
                            onClick={() => handleDelete(user.id!)}
                            className="w-4 mr-2 mt-1 transform hover:text-red-700 hover:scale-110"
                          >
                            <DeleteIcon />
                          </div>
                          <div
                            onClick={() =>
                              handleLockUnlock(user.id!, user.is_active)
                            }
                            className="w-4 mr-2 mt-1 transform hover:scale-110"
                          >
                            <PowerIcon className="w-4 h-4 hover:fill-orange-700" />
                          </div>
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

export default ManageUsers;
