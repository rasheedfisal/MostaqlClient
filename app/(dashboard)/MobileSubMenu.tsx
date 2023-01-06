"use client";
import { Cycle, motion } from "framer-motion";
import React, { KeyboardEventHandler, MouseEventHandler } from "react";
import Image from "next/image";
import avatar from "../../public/avatar.jpg";
import { useMutation } from "@tanstack/react-query";
import { logoutUserFn } from "../api/authApi";
import { useRouter } from "next/navigation";
import { useStateContext } from "../../context/AppConext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
type MobileSubProps = {
  toggleTheme: MouseEventHandler;
  isDark: boolean;
  openNotificationsPanel: MouseEventHandler;
  openSearchPanel: MouseEventHandler;
  openSettingsPanel: MouseEventHandler;
  OpenUserProfilePanel: MouseEventHandler;
  openUserProfile: boolean;
  handleSideMenuSpace: KeyboardEventHandler<HTMLDivElement>;
};

const MobileSubMenu = ({
  toggleTheme,
  isDark,
  openNotificationsPanel,
  openSearchPanel,
  openSettingsPanel,
  OpenUserProfilePanel,
  openUserProfile,
  handleSideMenuSpace,
}: MobileSubProps) => {
  const router = useRouter();
  const stateContext = useStateContext();

  const { mutate: logoutUser, isLoading } = useMutation(() => logoutUserFn(), {
    onSuccess: () => {
      stateContext.tokenDispatch({ type: "SET_Token", payload: null });
      toast.success("You successfully logged out");
      Cookies.remove("loggedin");
      // Cookies.remove("accessToken");
      router.push("/");
    },
    onError: (error: any) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: 100 }}
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
        y: 100,
        transition: {
          ease: "easeOut",
          duration: 0.2,
        },
      }}
      onKeyDown={handleSideMenuSpace}
      className={`absolute flex items-center z-10 p-4 bg-white rounded-md shadow-lg dark:bg-darker top-16 inset-x-4 md:hidden`}
      aria-label="Secondary"
    >
      <div className="space-x-2">
        {/* <!-- Toggle dark theme button --> x-cloak @click="toggleTheme"*/}
        <button
          aria-hidden="true"
          className="relative focus:outline-none"
          onClick={toggleTheme}
        >
          <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-lighter"></div>
          <div
            className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 transform scale-110 rounded-full shadow-sm
            ${
              // isDark && loaded
              isDark
                ? "translate-x-6 text-primary-100 bg-primary-darker"
                : "translate-x-0 -translate-y-px  bg-white text-primary-dark"
            }`}
          >
            <svg
              // x-show="!isDark"
              className={`w-4 h-4 ${
                // isDark && loaded ? "hidden" : ""
                isDark ? "hidden" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <svg
              // x-show="isDark"
              className={`w-4 h-4 ${
                // !isDark && loaded ? "hidden" : ""
                !isDark ? "hidden" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
        </button>

        {/* <!-- Notification button --> */}
        <button
          // @click="openNotificationsPanel(); $nextTick(() => { isMobileSubMenuOpen = false })"
          onClick={openNotificationsPanel}
          className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
        >
          <span className="sr-only">Open notifications panel</span>
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* <!-- Search button --> */}
        <button
          onClick={openSearchPanel}
          // @click="openSearchPanel(); $nextTick(() => { $refs.searchInput.focus(); setTimeout(() => {isMobileSubMenuOpen= false}, 100) })"
          className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
        >
          <span className="sr-only">Open search panel</span>
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* <!-- Settings button --> */}
        <button
          onClick={openSettingsPanel}
          // @click="openSettingsPanel(); $nextTick(() => { isMobileSubMenuOpen = false })"
          className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
        >
          <span className="sr-only">Open settings panel</span>
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* <!-- User avatar button --> x-data="{ open: false }"*/}
      <div className="relative ml-auto">
        <button
          // @click="open = !open"
          onClick={OpenUserProfilePanel}
          type="button"
          aria-haspopup="true"
          // :aria-expanded="open ? 'true' : 'false'"
          aria-expanded={openUserProfile ? "true" : "false"}
          className="block transition-opacity duration-200 rounded-full dark:opacity-75 dark:hover:opacity-100 focus:outline-none focus:ring dark:focus:opacity-100"
        >
          <span className="sr-only">User menu</span>
          <Image
            className="w-10 h-10 rounded-full"
            src={avatar}
            alt="Ahmed Kamel"
          />
        </button>
        {/* <!-- User dropdown menu --> */}
        {openUserProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                ease: "easeOut",
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                ease: "easeIn",
                duration: 0.2,
              },
            }}
            className={`absolute right-0 w-48 py-1 origin-top-right bg-white rounded-md shadow-lg top-12 ring-1 ring-black ring-opacity-5 dark:bg-dark`}
            role="menu"
            aria-orientation="vertical"
            aria-label="User menu"
          >
            <a
              href="#"
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary"
            >
              Your Profile
            </a>
            {/* <a
              href="#"
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary"
            >
              Settings
            </a> */}
            <span
              onClick={() => logoutUser()}
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary cursor-pointer"
            >
              {isLoading ? (
                <svg
                  className="w-6 h-6 mr-3 -ml-1 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "logout"
              )}
            </span>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default MobileSubMenu;
