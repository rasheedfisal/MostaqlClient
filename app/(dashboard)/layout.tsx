"use client";

import { useState, useRef } from "react";
import Backdrop from "../../components/Backdrop";
import SettingPanel from "../../components/SettingPanel";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import { usePathname } from "next/navigation";
import NotificationPanel from "./NotificationPanel";
import SearchPanel from "./SearchPanel";
import { useLocalStorage } from "../../hooks/useStorage";
import { useLoaded } from "../../hooks/useLoaded";
// import { BounceLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import Persist from "./Persist";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { setColors } from "../ThemeSettings";
import useAccessToken from "../../hooks/useAccessToken";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAccessToken();
  const loaded = useLoaded();
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useLocalStorage("dark", false);

  const [isMobileMainMenuOpen, setIsMobileMainMenuOpen] = useState(false);
  useState(false);

  const [sidebar, setSidebar] = useState(true);

  const pathname = usePathname();

  const [openSetting, openSettingHandler] = useCycle(false, true);
  const [openUserProfile, setOpenUserProfile] = useCycle(false, true);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useCycle(
    false,
    true
  );
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useCycle(false, true);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useCycle(false, true);

  // const setTheme = (value: string) => {
  //   window.localStorage.setItem("dark", value);
  // };
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    // setTheme(!isDark as unknown as string);
  };
  // const toggleSidbarMenu = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  const openSettingsPanel = () => {
    settingsPanelRef?.current?.focus();
    openSettingHandler();
  };
  const openNotificationsPanel = () => {
    notificationsPanelRef?.current?.focus();
    setIsNotificationsPanelOpen();
  };

  const OpenUserProfilePanel = () => {
    setOpenUserProfile();
    if (openUserProfile) {
      userMenuRef?.current?.focus();
    }
  };
  const openSearchPanel = () => {
    searchInputRef?.current?.focus();
    setIsSearchPanelOpen();
  };
  const handleUserSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      setOpenUserProfile();
    }
  };
  const handleSideMenuSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "32") {
      setIsMobileSubMenuOpen();
    }
  };
  // const getColor = (): string => {
  //   if (typeof window !== "undefined") {
  //     if (window.localStorage.getItem("color")) {
  //       return JSON.parse(window.localStorage.getItem("color")!);
  //     } else {
  //       return "cyan";
  //     }
  //   }

  //   return "cyan";
  // };
  const [color, setColor] = useLocalStorage("color", "cyan");

  const variants = {
    inactive: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    out: {
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    in: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  useUpdateEffect(() => {
    setColors(color);
  }, []);

  useUpdateEffect(() => {
    setTimeout(() => setIsMobileSubMenuOpen(0), 100);
  }, [isNotificationsPanelOpen, isSearchPanelOpen, openSetting]);
  // useUpdateEffect(() => {
  //   setIsDark(isDark);
  // }, [isDark]);

  return (
    <div className={isDark && loaded ? "dark" : ""}>
      <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        {/* <!-- Loading screen --> */}

        {/* <!-- Sidebar --> */}

        <AnimatePresence>
          {sidebar && <SideBar openSettingsPanel={openSettingsPanel} />}
        </AnimatePresence>

        <div className="flex-1 h-full overflow-x-hidden overflow-y-auto">
          {/* <!-- Navbar --> */}
          <NavBar
            OpenUserProfilePanel={OpenUserProfilePanel}
            handleSideMenuSpace={handleSideMenuSpace}
            handleUserSpace={handleUserSpace}
            isDark={isDark}
            isMobileMainMenuOpen={isMobileMainMenuOpen}
            isMobileSubMenuOpen={isMobileSubMenuOpen}
            openNotificationsPanel={openNotificationsPanel}
            openSearchPanel={openSearchPanel}
            openSettingsPanel={openSettingsPanel}
            openUserProfile={openUserProfile}
            setIsMobileMainMenuOpen={setIsMobileMainMenuOpen}
            setIsMobileSubMenuOpen={setIsMobileSubMenuOpen}
            setSidebar={setSidebar}
            toggleTheme={toggleTheme}
            userMenuRef={userMenuRef}
          />

          {/* <!-- Main content --> */}
          <main>
            <ToastContainer />
            {/* <!-- Content --> */}
            <div className="relative">
              <motion.div
                key={pathname}
                variants={variants}
                initial="in"
                animate="inactive"
                exit="out"
                className="m-2"
              >
                <Persist>{children}</Persist>
              </motion.div>
            </div>
          </main>
        </div>

        {/* Panels and Backdrops */}

        <AnimatePresence>
          {openSetting && (
            <>
              <Backdrop
                isOpen={openSetting}
                handleClick={() => openSettingHandler()}
              />
              <SettingPanel
                isDark={isDark}
                setIsDark={setIsDark}
                // setIsSettingsPanelOpen={setIsSettingsPanelOpen}
                handleClick={() => openSettingHandler()}
                settingPanelRef={settingsPanelRef}
                // setSelectedColor={setSelectedColor}
              />
            </>
          )}

          {isNotificationsPanelOpen && (
            <>
              <Backdrop
                isOpen={isNotificationsPanelOpen}
                handleClick={() => setIsNotificationsPanelOpen()}
              />
              <NotificationPanel
                handleClick={() => setIsNotificationsPanelOpen()}
                NotificationPanelRef={notificationsPanelRef}
              />
            </>
          )}

          {isSearchPanelOpen && (
            <>
              <Backdrop
                isOpen={isSearchPanelOpen}
                handleClick={() => setIsSearchPanelOpen()}
              />
              <SearchPanel
                handleClick={() => setIsSearchPanelOpen()}
                SearchPanelRef={searchInputRef}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
