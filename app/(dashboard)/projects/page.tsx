"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAccessToken from "../../../hooks/useAccessToken";
import { getAllProjectsFn } from "../../api/projectsApi";
import StatusBadge from "../../../components/StatusBadge";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import ReactPaginate from "react-paginate";
import { ChangeEvent, useState } from "react";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import TableLoader from "../../../components/TableLoader";
import useDebounce from "../../../hooks/useDebounce";
const page = () => {
  const [pages, setPages] = useState(0);
  const [records, setRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const token = useAccessToken();
  const queryClient = useQueryClient();
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  const {
    isLoading,
    data: projects,
    isFetching,
    isPreviousData,
  } = useQuery(
    ["projects", pageNumber, pageSize, debouncedSearchQuery],
    () => getAllProjectsFn(token, pageNumber, pageSize, debouncedSearchQuery),
    {
      select: (data) => data,
      retry: 1,
      // staleTime: 0,
      // cacheTime: 0,
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
        // console.log(error);
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  // const handlePageClick = (selected: number) => {
  //   setPageNumber(selected + 1);
  //   console.log(selected);
  // };

  const handlePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(e.target.value as unknown as number);
  };

  useUpdateEffect(() => {
    if (
      !isPreviousData &&
      projects?.results.length !== undefined &&
      projects?.results.length > 0
    ) {
      queryClient.prefetchQuery(
        ["projects", pageNumber, pageSize, debouncedSearchQuery],
        () =>
          getAllProjectsFn(token, pageNumber, pageSize, debouncedSearchQuery)
      );
    }
  }, [
    projects,
    pageNumber,
    pageSize,
    debouncedSearchQuery,
    isPreviousData,
    queryClient,
  ]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Projects</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">project List</h3>
              </div>
            </div>
          </div>
          <div className="block w-full relative overflow-x-auto">
            <div className="flex justify-end mb-1">
              <div className="mt-1 rounded-md shadow-sm">
                <select
                  onChange={handlePageSize}
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="relative w-full md:w-1/3 mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm cursor-pointer hover:text-primary transition">
                    <AdjustmentsVerticalIcon className="h-4 w-4 dark:text-primary" />
                  </span>
                </div>
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="price"
                  value={searchQuery}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm dark:bg-dark"
                  placeholder="search..."
                />
                <div className="absolute inset-y-0 right-0 flex items-start">
                  <button className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500  sm:text-sm">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="search"
                      className="w-4 dark:text-primary"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              {isFetching && <TableLoader />}
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Title
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Period
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Attatchment
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Offers Count
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      owner
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Category
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Price Range
                    </th>
                    <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.results.map((project) => (
                    <tr key={project.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs font-semibold whitespace-nowrap p-4 ">
                        {project.proj_title}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {project.proj_period} Days
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {project.attatchment_file ? (
                          <Link
                            href={project.attatchment_file}
                            target="_blank"
                            className="text-blue-700 underline"
                          >
                            click to view
                          </Link>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex justify-evenly items-center">
                          {project.OffersCount}
                          {project.OffersCount !== 0 ? (
                            <Link
                              href={`/offers/${project.id}`}
                              className="w-4 mr-2 mt-1 transform hover:text-yellow-500 hover:scale-110"
                              title="view offers"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center text-sm">
                          <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src={project.owner.avatar ?? "noImg.jpg"}
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
                              {project.owner.fullname}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center text-sm">
                          <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src={
                                project.SubCategory!.Category.cat_img ??
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
                            <p className="font-semibold text-xs">
                              {project.SubCategory!.Category.cat_name}
                            </p>
                            <p className="font-semibold text-gray-400 text-xs">
                              {project.SubCategory!.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {project.PriceRange!.range_name}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <StatusBadge
                          statusName={project.ProjStatus!.stat_name}
                        />
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
