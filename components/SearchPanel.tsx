import React, { MouseEventHandler, RefObject, useState } from "react";
import { motion } from "framer-motion";
type SearchPanelProps = {
  SearchPanelRef: RefObject<HTMLInputElement>;
  handleClick: MouseEventHandler;
};

function SearchPanel({ SearchPanelRef, handleClick }: SearchPanelProps) {
  const handleSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      // setIsSettingsPanelOpen((prev) => !prev);
      handleClick;
    }
  };

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
            type="text"
            className="w-full py-2 pl-10 pr-4 border rounded-full dark:bg-dark dark:border-transparent dark:text-light focus:outline-none focus:ring"
            placeholder="Search..."
          />
        </div>

        {/* <!-- Panel content (Search result) --> */}
        <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-hidden h hover:overflow-y-auto">
          <h3 className="py-2 text-sm font-semibold text-gray-600 dark:text-light">
            History
          </h3>
          <a href="#" className="flex space-x-4">
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-lg"
                src="car-tech.jpg"
                alt="Post cover"
              />
            </div>
            <div className="flex-1 max-w-xs overflow-hidden">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-light">
                Header
              </h4>
              <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                Lorem ipsum dolor, sit amet consectetur.
              </p>
              <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                {" "}
                Post{" "}
              </span>
            </div>
          </a>
          <a href="#" className="flex space-x-4">
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-lg"
                src="product1.jpg"
                alt="Ahmed Kamel"
              />
            </div>
            <div className="flex-1 max-w-xs overflow-hidden">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-light">
                Ahmed Kamel
              </h4>
              <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                Last activity 3h ago.
              </p>
              <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                {" "}
                Offline{" "}
              </span>
            </div>
          </a>
          <a href="#" className="flex space-x-4">
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-lg"
                src="product2.jpg"
                alt="K-WD Dashboard"
              />
            </div>
            <div className="flex-1 max-w-xs overflow-hidden">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-light">
                K-WD Dashboard
              </h4>
              <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
              <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                {" "}
                Updated 3h ago.{" "}
              </span>
            </div>
          </a>
          <template x-for="i in 10" x-key="i">
            <a href="#" className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-lg"
                  src="product3.jpg"
                  alt="K-WD Dashboard"
                />
              </div>
              <div className="flex-1 max-w-xs overflow-hidden">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-light">
                  K-WD Dashboard
                </h4>
                <p className="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
                <span className="text-sm font-normal text-gray-400 dark:text-primary-light">
                  {" "}
                  Updated 3h ago.{" "}
                </span>
              </div>
            </a>
          </template>
        </div>
      </div>
    </motion.div>
  );
}

export default SearchPanel;
