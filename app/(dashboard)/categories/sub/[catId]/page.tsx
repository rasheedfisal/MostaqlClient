"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAccessToken from "../../../../../hooks/useAccessToken";
import {
  deleteCategoryFn,
  deleteSubCategoryFn,
  getAllCategoriesFn,
  getAllSubCategoriesFn,
} from "../../../../api/categoryApi";
import EditIcon from "../../../../../icons/EditIcon";
import DeleteIcon from "../../../../../icons/DeleteIcon";
import TableLoader from "../../../../../components/TableLoader";

type PageProps = {
  params: {
    catId: string;
  };
};

const page = ({ params: { catId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const { isLoading, data: categories, error } = useQuery({
      queryKey: ["subcategories", catId],
      queryFn: () => getAllSubCategoriesFn(token, catId),
      select: (data) => data,
      retry: 1,
    }
  );

  const { isPending: isDeleteing, mutate: deleteCategory } = useMutation(
    {
      mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
      deleteSubCategoryFn({ id, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["subcategories", catId]});
        toast.success("Sub Category deleted successfully");
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

  const handleDelete = (id: string) => {
    if (confirm("are you sure you want to delete?")) {
      deleteCategory({
        id: id,
        accessToken: token,
      });
    }
  };

  if (error !== null) {
    toast.error(error.message, {
            position: "top-right",
          });
  }

  if (isDeleteing) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Manage Sub Categories</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">Sub Category List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href={`/categories/sub/add/${catId}`}
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full relative overflow-x-auto">
            <div className="relative">
              {isDeleteing && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => (
                    <tr key={category.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {category.name}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <div className="flex">
                          <Link
                            href={`/categories/sub/${catId}/${category.id}`}
                            className="w-4 mr-2 mt-1 transform hover:text-purple-700 hover:scale-110"
                          >
                            <EditIcon />
                          </Link>
                          <div
                            onClick={() => handleDelete(category.id)}
                            className="w-4 mr-2 mt-1 transform hover:text-red-700 hover:scale-110"
                          >
                            <DeleteIcon />
                          </div>
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
