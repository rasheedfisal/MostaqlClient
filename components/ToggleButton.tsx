import React, { MouseEventHandler, useState } from "react";

type ToggleProps = {
  name: string;
  title: string;
  isEnabled: boolean;
};
const ToggleButton = ({ name, title, isEnabled }: ToggleProps) => {
  const [isOn, setIsOn] = useState(isEnabled);
  return (
    <label className="flex items-center">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          name={name}
          className="w-10 h-4 transition bg-gray-200 border-none rounded-full shadow-inner outline-none appearance-none toggle checked:bg-primary-light disabled:bg-gray-200 focus:outline-none"
          // checked={isEnabled}
        />
        <span className="absolute top-0 left-0 w-4 h-4 transition-all transform scale-150 bg-white rounded-full shadow-sm"></span>
      </div>
      <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
        {title}
      </span>
    </label>

    // <button
    //   className="relative focus:outline-none"
    //   onClick={() => setIsOn((prev) => !prev)}
    // >
    //   <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"></div>
    //   <div
    //     className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm   ${
    //       isOn
    //         ? "translate-x-6 bg-primary-light dark:bg-primary"
    //         : "translate-x-0  bg-white dark:bg-primary-100"
    //     }`}
    //   ></div>
    // </button>
    // <button
    //   aria-hidden="true"
    //   className="relative focus:outline-none"
    //   onClick={toggleButton}
    // >
    //   <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-lighter"></div>
    //   <div
    //     className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 transform scale-110 rounded-full shadow-sm
    //         ${
    //           isEnabled
    //             ? "translate-x-6 text-primary-100 bg-primary-darker"
    //             : "translate-x-0 -translate-y-px  bg-white text-primary-dark"
    //         }`}
    //   >
    //     <svg
    //       className={`w-4 h-4 ${isEnabled ? "hidden" : ""}`}
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    //       />
    //     </svg>
    //     <svg
    //       className={`w-4 h-4 ${!isEnabled ? "hidden" : ""}`}
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    //       />
    //     </svg>
    //   </div>
    // </button>
  );
};

export default ToggleButton;
