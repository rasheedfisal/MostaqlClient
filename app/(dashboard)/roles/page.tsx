"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAccessToken from "../../../hooks/useAccessToken";
import { deleteRoleFn, getAllRolesFn } from "../../api/rolesApi";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import TableLoader from "../../../components/TableLoader";
const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const { isLoading, data: roles, error } = useQuery(
    {
      queryKey: ["roles"],
      queryFn: () => getAllRolesFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending: isDeleteing, mutate: deleteRole } = useMutation(
    {
      mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
        deleteRoleFn({ id, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["roles"]});
        toast.success("Role deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const handleDelete = (id: string) => {
    if (confirm("are you sure you want to delete?")) {
      deleteRole({
        id: id,
        accessToken: token,
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
        <h1 className="text-2xl font-semibold">Manage Roles</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">Role List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/roles/add"
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <div className="relative">
              {isDeleteing && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Description
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles?.results.map((role) => (
                    <tr key={role.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {role.role_name}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {role.role_description}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex">
                          <Link
                            href={`/roles/${role.id}`}
                            className="w-4 mr-2 mt-1 transform hover:text-purple-700 hover:scale-110"
                          >
                            <EditIcon />
                          </Link>
                          <div
                            onClick={() => handleDelete(role.id)}
                            className="w-4 mr-2 mt-1 transform hover:text-red-700 hover:scale-110"
                          >
                            <DeleteIcon />
                          </div>
                          <Link
                            href={`permissions/role/${role.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          >
                            Manage Permissions
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
