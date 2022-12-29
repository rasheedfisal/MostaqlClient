import { AnimatePresence, Cycle } from "framer-motion";
import React, {
  Dispatch,
  KeyboardEventHandler,
  MouseEventHandler,
  RefObject,
  SetStateAction,
} from "react";
import MobileSubMenu from "./MobileSubMenu";
import MobileMainMenu from "./MobileMainMenu";
import DesktopMenu from "./DesktopMenu";
import Link from "next/link";

type NavProps = {
  setIsMobileMainMenuOpen: Dispatch<SetStateAction<boolean>>;
  setSidebar: Dispatch<SetStateAction<boolean>>;
  isMobileMainMenuOpen: boolean;
  setIsMobileSubMenuOpen: Cycle;
  isMobileSubMenuOpen: boolean;
  toggleTheme: MouseEventHandler;
  isDark: boolean;
  openNotificationsPanel: MouseEventHandler;
  openSearchPanel: MouseEventHandler;
  openSettingsPanel: MouseEventHandler;
  OpenUserProfilePanel: MouseEventHandler;
  openUserProfile: boolean;
  userMenuRef: RefObject<HTMLDivElement>;
  handleUserSpace: KeyboardEventHandler<HTMLDivElement>;
  handleSideMenuSpace: KeyboardEventHandler<HTMLDivElement>;
};

const NavBar = ({
  setIsMobileMainMenuOpen,
  setSidebar,
  isMobileMainMenuOpen,
  setIsMobileSubMenuOpen,
  isMobileSubMenuOpen,
  toggleTheme,
  isDark,
  openNotificationsPanel,
  openSearchPanel,
  openSettingsPanel,
  OpenUserProfilePanel,
  openUserProfile,
  userMenuRef,
  handleUserSpace,
  handleSideMenuSpace,
}: NavProps) => {
  return (
    <header className="relative bg-white dark:bg-darker">
      <div className="flex items-center justify-between p-2 border-b dark:border-primary-darker">
        {/* <!-- Mobile menu button --> */}
        <button
          onClick={() => setIsMobileMainMenuOpen((prev) => !prev)}
          className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:hidden focus:outline-none focus:ring"
        >
          <span className="sr-only">Open main manu</span>
          <span aria-hidden="true">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
        </button>

        {/* <!-- Brand --> */}
        <div className="flex items-center content-between ">
          <span
            onClick={() => setSidebar((prev) => !prev)}
            className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:inline-block hidden focus:outline-none focus:ring cursor-pointer"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
          <Link
            href="/home"
            className="inline-block text-2xl pl-3 font-bold tracking-wider uppercase text-primary-dark dark:text-light"
          >
            مستقل
          </Link>
        </div>

        {/* <!-- Mobile sub menu button --> */}
        <button
          onClick={() => setIsMobileSubMenuOpen()}
          className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:hidden focus:outline-none focus:ring"
        >
          <span className="sr-only">Open sub manu</span>
          <span aria-hidden="true">
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </span>
        </button>

        {/* <!-- Desktop Right buttons --> */}
        <DesktopMenu
          OpenUserProfilePanel={OpenUserProfilePanel}
          handleUserSpace={handleUserSpace}
          isDark={isDark}
          openNotificationsPanel={openNotificationsPanel}
          openSearchPanel={openSearchPanel}
          openSettingsPanel={openSettingsPanel}
          openUserProfile={openUserProfile}
          toggleTheme={toggleTheme}
          userMenuRef={userMenuRef}
        />
        {/* <!-- Mobile sub menu --> */}
        <AnimatePresence>
          {isMobileSubMenuOpen && (
            <MobileSubMenu
              OpenUserProfilePanel={OpenUserProfilePanel}
              handleSideMenuSpace={handleSideMenuSpace}
              isDark={isDark}
              openNotificationsPanel={openNotificationsPanel}
              openSearchPanel={openSearchPanel}
              openSettingsPanel={openSettingsPanel}
              openUserProfile={openUserProfile}
              setIsMobileSubMenuOpen={setIsMobileSubMenuOpen}
              toggleTheme={toggleTheme}
            />
          )}
        </AnimatePresence>
      </div>
      {/* <!-- Mobile main manu --> */}
      <MobileMainMenu isMobileMainMenuOpen={isMobileMainMenuOpen} />
    </header>
  );
};

export default NavBar;
