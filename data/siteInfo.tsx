import { HomeIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";

interface ILinks {
  title: string;
  icon: JSX.Element;
  links: ILinkItems[];
}
interface ILinkItems {
  name: string;
  path: string;
}
export const links: ILinks[] = [
  {
    title: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    links: [
      {
        name: "Home",
        path: "/home",
      },
    ],
  },

  {
    title: "Users",
    icon: <ShieldExclamationIcon className="w-5 h-5" />,
    links: [
      {
        name: "Manage",
        path: "/users",
      },
    ],
  },
  {
    title: "Roles",
    icon: <ShieldExclamationIcon className="w-5 h-5" />,
    links: [
      {
        name: "Manage",
        path: "/roles",
      },
    ],
  },
];
