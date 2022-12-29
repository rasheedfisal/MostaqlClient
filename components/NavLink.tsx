import React, { KeyboardEvent, MouseEvent, ReactNode, useState } from "react";

type NavLinkProps = {
  title: string;
  icon: JSX.Element;
  open: boolean;
  active: boolean;
  children: ReactNode;
};

function NavLink({ title, icon, open, active, children }: NavLinkProps) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div>
      <a
        href="#"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
          active || isOpen ? "bg-primary-100 dark:bg-primary" : ""
        }`}
        role="button"
        aria-haspopup="true"
        aria-expanded={active || isOpen ? true : false}
      >
        <span aria-hidden="true">
          {/* <svg
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg> */}
          {icon}
        </span>
        <span className="ml-2 text-sm"> {title} </span>
        <span className="ml-auto" aria-hidden="true">
          {/* <!-- active class 'rotate-180' --> */}
          <svg
            className={`w-4 h-4 transition-transform transform ${
              isOpen && "rotate-180"
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </a>
      <div
        role="menu"
        className={`mt-2 space-y-2 px-7 ${!isOpen && "hidden"}`}
        aria-label={title}
      >
        {children}
      </div>
    </div>
  );
}

export default NavLink;
