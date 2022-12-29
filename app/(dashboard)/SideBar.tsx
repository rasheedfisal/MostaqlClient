import {
  DocumentIcon,
  HomeIcon,
  PaperAirplaneIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { MouseEventHandler } from "react";
import NavLink from "../../components/NavLink";

import { links } from "../../data/siteInfo";

type SidebarProps = {
  openSettingsPanel: MouseEventHandler;
};

const SideBar = ({ openSettingsPanel }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{
        x: 0,
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      }}
      exit={{
        x: -200,
        transition: {
          ease: "easeOut",
          duration: 0.3,
        },
      }}
      className="flex-shrink-0 hidden w-64 bg-white border-r dark:border-primary-darker dark:bg-darker md:block"
    >
      <div className="flex flex-col h-full">
        {/*  <!-- Sidebar links --> */}
        <nav
          aria-label="Main"
          className="flex-1 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto"
        >
          {/*  <!-- Dashboards links --> */}

          {links.map((item) => (
            <NavLink
              key={item.title}
              title={item.title}
              icon={item.icon}
              open={true}
              active={true}
            >
              {item.links.map((itemLink) => (
                <Link
                  key={itemLink.name}
                  href={itemLink.path}
                  role="menuitem"
                  className="block p-2 text-sm text-gray-700 transition-colors duration-200 rounded-md dark:text-light dark:hover:text-light hover:text-gray-700"
                >
                  {itemLink.name}
                </Link>
              ))}
            </NavLink>
          ))}

          {/* Authentication links */}
          <NavLink
            title="Authentication"
            icon={<ShieldExclamationIcon className="w-5 h-5" />}
            open={false}
            active={false}
          >
            {/* <!-- active & hover classes 'text-gray-700 dark:text-light' -->
                  <!-- inActive classes 'text-gray-400 dark:text-gray-400' --> */}
            <Link
              href="/register"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              Register
            </Link>
            <a
              href="/login"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              Login
            </a>
            <a
              href="#"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              Forgot Password
            </a>
            <a
              href="#"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              Reset Password
            </a>
          </NavLink>
        </nav>

        {/* <!-- Sidebar footer --> */}
        <div className="flex-shrink-0 px-2 py-4 space-y-2">
          <button
            // @click="openSettingsPanel"
            onClick={openSettingsPanel}
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
          >
            <span aria-hidden="true">
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </span>
            <span>Customize</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default SideBar;
