import React, { MouseEventHandler, RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUserNotitifcationsFn } from "../app/api/notificationApi";
import useAccessToken from "../hooks/useAccessToken";
import { toast } from "react-toastify";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { formatDistance, subDays, parseISO } from "date-fns";
import { useStateContext } from "../context/AppConext";
type NotificationPanelProps = {
  NotificationPanelRef: RefObject<HTMLDivElement>;
  handleClick: MouseEventHandler;
};

function NotificationPanel({
  NotificationPanelRef,
  handleClick,
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState("user");
  const token = useAccessToken();
  const stateContext = useStateContext();
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data: items,
    status,
    isLoading,
    isSuccess,
    error,
  } = useInfiniteQuery(
    ["notifications"],
    ({ pageParam = 1 }) => getAllUserNotitifcationsFn(token, pageParam),
    {
      retry: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
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
  const lastUserRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: lastUserRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });
  if (status === "error")
    return <p className="center">Error: {(error as any).response.data.msg}</p>;

  const handleSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      // setIsSettingsPanelOpen((prev) => !prev);
      handleClick;
    }
  };

  const setActiveClass = (tabname: string) => {
    return `px-px pb-4 transition-all duration-200 transform translate-y-px border-b focus:outline-none ${
      activeTab === tabname
        ? "border-primary-dark dark:border-primary"
        : "border-transparent"
    }`;
  };

  const content = items?.pages.map((pg) => {
    return pg.map((chatuser, i) => {
      return (
        <a
          href="#"
          key={i}
          className={`block hover:bg-primary-lighter rounded-md ${
            i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
        >
          <div className="flex px-4 space-x-4">
            <div className="relative flex-shrink-0">
              <span className="relative z-10 inline-block overflow-visible rounded-ful">
                {!chatuser.read ? (
                  <span className="absolute -top-2 -right-1 h-5 w-8 rounded-full bg-red-600 flex justify-center items-center items">
                    <span className="text-light text-xs">new</span>
                  </span>
                ) : null}
                <img
                  className="object-cover rounded-full w-9 h-9"
                  src={chatuser.imgPath ?? "/noImg.jpg"}
                  alt="user"
                />
              </span>
              <div className="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <h5 className="text-sm font-semibold text-gray-600 dark:text-light">
                {chatuser.fullname}
              </h5>
              <span className="text-sm text-gray-600 dark:text-primary-light ">
                {chatuser.role_name}
              </span>
              <h6 className="text-sm font-semibold text-gray-600 dark:text-light">
                {chatuser.title}
                {/* {chatuser.receiver_id} */}
              </h6>
              <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-light">
                {chatuser.description}
              </p>
              {/* <p className="text-sm font-normal text-gray-400 dark:text-primary-light">
                
              </p> */}
              <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                {formatDistance(
                  parseISO(chatuser.createdAt.toString()),
                  subDays(new Date(), 0),
                  {
                    addSuffix: true,
                    includeSeconds: true,
                  }
                )}
              </span>
            </div>
          </div>
        </a>
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
      ref={NotificationPanelRef}
      onKeyDown={handleSpace}
      tabIndex={-1}
      aria-labelledby="notificationPanelLabel"
      className="fixed inset-y-0 z-20 w-full max-w-xs bg-white dark:bg-darker dark:text-light sm:max-w-md focus:outline-none"
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
      <div className="flex flex-col h-screen">
        {/* <!-- Panel header --> */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between px-4 pt-4 border-b dark:border-primary-darker">
            <h2 id="notificationPanelLabel" className="pb-4 font-semibold">
              Notifications
            </h2>
            <div className="space-x-2">
              {/* <button
                onClick={() => setActiveTab("action")}
                className={setActiveClass("action")}
              >
                Action
              </button> */}
              <button
                onClick={() => setActiveTab("user")}
                className={setActiveClass("user")}
              >
                User
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Panel content (tabs) --> */}
        <div className="flex-1 pt-4 overflow-y-hidden hover:overflow-y-auto">
          {/* <!-- Action tab --> */}
          {/* {activeTab === "action" && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeInOut",
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                y: -100,
                transition: {
                  ease: "easeOut",
                  duration: 0.2,
                },
              }}
            >
              <a href="#" className="block">
                <div className="flex px-4 space-x-4">
                  <div className="relative flex-shrink-0">
                    <span className="z-10 inline-block p-2 overflow-visible rounded-full bg-primary-50 text-primary-light dark:bg-primary-darker">
                      <svg
                        className="w-7 h-7"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </span>
                    <div className="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-sm font-semibold text-gray-600 dark:text-light">
                      New project "KWD Dashboard" created
                    </h5>
                    <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                      Looks like there might be a new theme soon
                    </p>
                    <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                      {" "}
                      9h ago{" "}
                    </span>
                  </div>
                </div>
              </a>
              <a href="#" className="block">
                <div className="flex px-4 space-x-4">
                  <div className="relative flex-shrink-0">
                    <span className="inline-block p-2 overflow-visible rounded-full bg-primary-50 text-primary-light dark:bg-primary-darker">
                      <svg
                        className="w-7 h-7"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </span>
                    <div className="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-sm font-semibold text-gray-600 dark:text-light">
                      KWD Dashboard v0.0.2 was released
                    </h5>
                    <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                      Successful new version was released
                    </p>
                    <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                      {" "}
                      2d ago{" "}
                    </span>
                  </div>
                </div>
              </a>
              <template x-for="i in 20" x-key="i">
                <a href="#" className="block">
                  <div className="flex px-4 space-x-4">
                    <div className="relative flex-shrink-0">
                      <span className="inline-block p-2 overflow-visible rounded-full bg-primary-50 text-primary-light dark:bg-primary-darker">
                        <svg
                          className="w-7 h-7"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </span>
                      <div className="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-light">
                        New project "KWD Dashboard" created
                      </h5>
                      <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                        Looks like there might be a new theme soon
                      </p>
                      <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                        {" "}
                        9h ago{" "}
                      </span>
                    </div>
                  </div>
                </a>
              </template>
            </motion.div>
          )} */}

          {/* <!-- User tab --> */}
          {activeTab === "user" && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeInOut",
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                y: -100,
                transition: {
                  ease: "easeOut",
                  duration: 0.2,
                },
              }}
            >
              <div>
                {isLoading && <p className="center">Loading...</p>}
                {isSuccess && content}
                <div
                  ref={lastUserRef}
                  className={`${!hasNextPage ? "hidden" : ""}`}
                >
                  {isFetchingNextPage && (
                    <p className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                      Loading More...
                    </p>
                  )}
                </div>

                {!hasNextPage && !isLoading && (
                  <div className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                    No More Notifications
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default NotificationPanel;
