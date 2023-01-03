import {
  HomeIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/solid";

interface ILinks {
  title: string;
  icon: JSX.Element;
  links: ILinkItems[];
  open: boolean;
  active: boolean;
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
    open: true,
    active: true,
  },
  {
    title: "Projects",
    icon: <CubeTransparentIcon className="w-5 h-5" />,
    links: [
      {
        name: "Manage",
        path: "/projects",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Support",
    icon: <HandRaisedIcon className="w-5 h-5" />,
    links: [
      {
        name: "Chat Engin",
        path: "/chat",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Security",
    icon: <ShieldExclamationIcon className="w-5 h-5" />,
    links: [
      {
        name: "Users",
        path: "/users",
      },
      {
        name: "Roles",
        path: "/roles",
      },
      {
        name: "Login",
        path: "/login",
      },
      {
        name: "Register",
        path: "/register",
      },
    ],
    open: false,
    active: false,
  },
];
