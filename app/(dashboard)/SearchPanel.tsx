"use client";
import React, {
  MouseEventHandler,
  RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import useAccessToken from "../../hooks/useAccessToken";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllChatUsersFn } from "../api/chatApi";
import { toast } from "react-toastify";
import { ISysUser } from "../../typings";
import { useStateContext } from "../../context/AppConext";
import useDebounce from "../../hooks/useDebounce";
import useUpdateEffect from "../../hooks/useUpdateEffect";

type SearchPanelProps = {
  SearchPanelRef: RefObject<HTMLInputElement>;
  handleClick: MouseEventHandler;
};

function SearchPanel({ SearchPanelRef, handleClick }: SearchPanelProps) {
  const token = useAccessToken();
  const stateContext = useStateContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pages, setPages] = useState(0);
  const queryClient = useQueryClient();
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  // const [hasNextPage, setHasNextPage] = useState(false);

  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    isFetching,
    data: items,
    status,
    isLoading,
    error,
  } = useInfiniteQuery(
    ["chatusers", debouncedSearchQuery],
    ({ pageParam = 1 }) =>
      getAllChatUsersFn(token, pageParam, debouncedSearchQuery),
    {
      // select: (data) => data,
      retry: 1,
      // keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      onSuccess: (e) => {
        // setHasNextPage(e.currentPage < e.totalPages);
        // data?.pages.map((pg) => {
        //   setSearchUser((prev) => Array.from(new Set([...prev, ...pg])));
        // });
        // if (e?.currentPage) {
        //   setPageNumber(e.currentPage);
        // }
        // if (e?.totalPages) {
        //   setPages(e.totalPages);
        // }
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
    queryClient.invalidateQueries(["chatusers", debouncedSearchQuery]);
  }, [debouncedSearchQuery]);

  // useUpdateEffect(() => {
  //   if (
  //     !isPreviousData &&
  //     items?.results.length !== undefined &&
  //     items?.results.length > 0 &&
  //     hasNextPage
  //   ) {
  //     queryClient.prefetchQuery(
  //       ["chatusers", pageNumber, debouncedSearchQuery],
  //       () => getAllChatUsersFn(token, pageNumber, debouncedSearchQuery)
  //     );
  //   }
  // }, [items, pageNumber, queryClient]);

  const intObserver = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((user) => {
        if (user[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) intObserver.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );
  if (status === "error")
    return <p className="center">Error: {(error as any).response.data.msg}</p>;

  const handleSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      handleClick;
    }
  };
  const setCurrentChatUser = (user: ISysUser): void => {
    // console.log(user);
    stateContext.chatDispatch({
      type: "SET_Current_Chat",
      payload: user,
      setChat: true,
    });
  };

  // if (isLoading) {
  //   return <p className="center">Loading...</p>;
  // }

  const content = items?.pages.map((pg) => {
    return pg.map((chatuser, i) => {
      return (
        <span
          key={chatuser.id}
          onClick={() => setCurrentChatUser(chatuser)}
          className="flex space-x-4 p-2 hover:bg-primary-lighter rounded-md"
        >
          <div className="flex-shrink-0">
            <img
              className="w-10 h-10 rounded-lg"
              src={chatuser.imgPath ?? "/noImg.jpg"}
              alt="avatar"
              loading="lazy"
            />
          </div>
          <div className="flex-1 max-w-xs overflow-hidden">
            <h4 className="text-sm font-semibold  dark:text-light">
              {chatuser.fullname}
            </h4>
            {/* <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
      Lorem ipsum dolor, sit amet consectetur.
    </p> */}
            <span className="text-sm font-normal  dark:text-primary-light">
              {chatuser.Role?.role_name}
            </span>
          </div>
        </span>
      );
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          ease: "easeInOut",
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        x: -100,
        transition: {
          ease: "easeOut",
          duration: 0.2,
        },
      }}
      onKeyDown={handleSpace}
      className="fixed inset-y-0 z-20 w-full max-w-xs bg-white shadow-xl dark:bg-darker dark:text-light sm:max-w-md focus:outline-none"
    >
      <div className="absolute right-0 p-2 transform translate-x-full">
        {/* <!-- Close button --> */}
        <button
          onClick={handleClick}
          className="p-2 text-white rounded-md focus:outline-none focus:ring"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h2 className="sr-only">Search panel</h2>
      {/* <!-- Panel content --> */}
      <div className="flex flex-col h-screen">
        {/* <!-- Panel header (Search input) --> */}
        <div className="relative flex-shrink-0 px-4 py-8 text-gray-400 border-b dark:border-primary-darker dark:focus-within:text-light focus-within:text-gray-700">
          <span className="absolute inset-y-0 inline-flex items-center px-4">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            ref={SearchPanelRef}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="w-full py-2 pl-10 pr-4 border rounded-full dark:bg-dark dark:border-transparent dark:text-light focus:outline-none focus:ring"
            placeholder="Search..."
          />
        </div>

        {/* <!-- Panel content (Search result) --> */}
        <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-hidden h hover:overflow-y-auto">
          <h3 className="py-2 text-sm font-semibold text-gray-600 dark:text-light">
            Users
          </h3>
          {isFetching ? (
            <p className="center">Loading...</p>
          ) : (
            <>
              {content}
              <div ref={lastUserRef} />
              {isFetchingNextPage && (
                <p className="center">Loading More Users...</p>
              )}
              <p className="center">
                <a href="#top">No More Users</a>
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SearchPanel;
