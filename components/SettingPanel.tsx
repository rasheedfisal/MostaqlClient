"use client";
import React, {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
} from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useStorage";
type SettingPanelProps = {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
  settingPanelRef: RefObject<HTMLDivElement>;
  // setSelectedColor: Dispatch<SetStateAction<string>>;
  handleClick: MouseEventHandler;
};
function SettingPanel({
  isDark,
  setIsDark,
  settingPanelRef,
  // setSelectedColor,
  handleClick,
}: SettingPanelProps) {
  // @keydown.escape="isSettingsPanelOpen = false"
  const handleSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      handleClick;
    }
  };

  const [color, setColor] = useLocalStorage("color", "cyan");
  const setColors = (color: string) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", `var(--color-${color})`);
    root.style.setProperty("--color-primary-50", `var(--color-${color}-50)`);
    root.style.setProperty("--color-primary-100", `var(--color-${color}-100)`);
    root.style.setProperty(
      "--color-primary-light",
      `var(--color-${color}-light)`
    );
    root.style.setProperty(
      "--color-primary-lighter",
      `var(--color-${color}-lighter)`
    );
    root.style.setProperty(
      "--color-primary-dark",
      `var(--color-${color}-dark)`
    );
    root.style.setProperty(
      "--color-primary-darker",
      `var(--color-${color}-darker)`
    );
    // setSelectedColor(color);
    // window.localStorage.setItem("color", color);
    setColor(color);
    //
  };
  // const setTheme = (value: string) => {
  //   window.localStorage.setItem("dark", value);
  // };
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
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
        x: 100,
        transition: {
          ease: "easeOut",
          duration: 0.2,
        },
      }}
      onKeyDown={handleSpace}
      ref={settingPanelRef}
      tabIndex={-1}
      className={`fixed inset-y-0 right-0 z-20 w-full max-w-xs bg-white shadow-xl dark:bg-darker dark:text-light sm:max-w-md focus:outline-none 
       
      `}
      //${!isOpen ? "invisible" : "visible"}
      aria-labelledby="settinsPanelLabel"
    >
      <div className="absolute left-0 p-2 transform -translate-x-full">
        {/* <!-- Close button --> */}
        <button
          // @click="isSettingsPanelOpen = false"
          // onClick={() => setIsSettingsPanelOpen(false)}
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
      {/* <!-- Panel content --> */}
      <div className="flex flex-col h-screen">
        {/* <!-- Panel header --> */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 px-4 py-8 space-y-4 border-b dark:border-primary-dark">
          <span aria-hidden="true" className="text-gray-500 dark:text-primary">
            <svg
              className="w-8 h-8"
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
          <h2
            id="settinsPanelLabel"
            className="text-xl font-medium text-gray-500 dark:text-light"
          >
            Settings
          </h2>
        </div>
        {/* <!-- Content --> */}
        <div className="flex-1 overflow-hidden hover:overflow-y-auto">
          {/* <!-- Theme --> */}
          <div className="p-4 space-y-4 md:p-8">
            <h6 className="text-lg font-medium text-gray-400 dark:text-light">
              Mode
            </h6>
            <div className="flex items-center space-x-8">
              {/* <!-- Light button --> */}
              <button
                // @click="setLightTheme"
                onClick={() => {
                  // setTheme("false");
                  setIsDark(false);
                }}
                className={`flex items-center justify-center px-4 py-2 space-x-4 transition-colors border rounded-md hover:text-gray-900 hover:border-gray-900 dark:border-primary dark:hover:text-primary-100 dark:hover:border-primary-light focus:outline-none focus:ring focus:ring-primary-lighter focus:ring-offset-2 dark:focus:ring-offset-dark dark:focus:ring-primary-dark ${
                  isDark
                    ? "border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100"
                    : "text-gray-500 dark:text-primary-light"
                }`}
                // :class="{ 'border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100': !isDark, 'text-gray-500 dark:text-primary-light': isDark }"
              >
                <span>
                  <svg
                    className="w-6 h-6"
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
                </span>
                <span>Light</span>
              </button>

              {/* <!-- Dark button --> */}
              <button
                // @click="setDarkTheme"
                onClick={() => {
                  // setTheme("true");
                  setIsDark(true);
                }}
                className={`flex items-center justify-center px-4 py-2 space-x-4 transition-colors border rounded-md hover:text-gray-900 hover:border-gray-900 dark:border-primary dark:hover:text-primary-100 dark:hover:border-primary-light focus:outline-none focus:ring focus:ring-primary-lighter focus:ring-offset-2 dark:focus:ring-offset-dark dark:focus:ring-primary-dark ${
                  isDark
                    ? "border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100"
                    : "text-gray-500 dark:text-primary-light"
                }`}
                // :class="{ 'border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100': isDark, 'text-gray-500 dark:text-primary-light': !isDark }"
              >
                <span>
                  <svg
                    className="w-6 h-6"
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
                </span>
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* <!-- Colors --> */}
          <div className="p-4 space-y-4 md:p-8">
            <h6 className="text-lg font-medium text-gray-400 dark:text-light">
              Colors
            </h6>
            <div>
              <button
                onClick={() => setColors("cyan")}
                className="w-10 h-10 rounded-full"
                // style="background-color: var(--color-cyan)"
                style={{ backgroundColor: "var(--color-cyan)" }}
              ></button>
              <button
                // @click="setColors('teal')"
                onClick={() => setColors("teal")}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: "var(--color-teal)" }}
              ></button>
              <button
                // @click="setColors('green')"
                onClick={() => setColors("green")}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: "var(--color-green)" }}
              ></button>
              <button
                // @click="setColors('fuchsia')"
                onClick={() => setColors("fuchsia")}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: "var(--color-fuchsia)" }}
              ></button>
              <button
                // @click="setColors('blue')"
                onClick={() => setColors("blue")}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: "var(--color-blue)" }}
              ></button>
              <button
                // @click="setColors('violet')"
                onClick={() => setColors("violet")}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: "var(--color-violet)" }}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SettingPanel;
