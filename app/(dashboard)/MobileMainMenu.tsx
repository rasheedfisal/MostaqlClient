"use client";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import NavLink from "../../components/NavLink";
import { links } from "../../data/siteInfo";
type MobileMainProps = {
  isMobileMainMenuOpen: boolean;
};
const MobileMainMenu = ({ isMobileMainMenuOpen }: MobileMainProps) => {
  return (
    <div
      className={`border-b md:hidden dark:border-primary-darker ${
        !isMobileMainMenuOpen ? "hidden" : ""
      }`}
    >
      <nav aria-label="Main" className="px-2 py-4 space-y-2">
        {/*  <!-- Dashboards links --> */}

        {links.map((item) => (
          <NavLink
            key={item.title}
            title={item.title}
            icon={item.icon}
            open={item.open}
            active={item.active}
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
      </nav>
    </div>
  );
};

export default MobileMainMenu;
