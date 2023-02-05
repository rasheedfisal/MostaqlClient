import {
  HomeIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  HandRaisedIcon,
  AdjustmentsVerticalIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
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
      {
        name: "Cancellation Requests",
        path: "/projectcancellation",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Notifications",
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    links: [
      {
        name: "Manage",
        path: "/notifications",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Payments",
    icon: <CurrencyDollarIcon className="w-5 h-5" />,
    links: [
      {
        name: "Account Feed Request",
        path: "/feed",
      },
      {
        name: "Withdrawal Request",
        path: "/withdrawrequest",
      },
      {
        name: "Completed Projects",
        path: "/projectcompleted",
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
      {
        name: "Complains & Suggestions",
        path: "/supportbox",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Configurations",
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    links: [
      {
        name: "Categories",
        path: "/categories",
      },
      {
        name: "Price Ranges",
        path: "/prices",
      },
      {
        name: "Commission Rate",
        path: "/rate",
      },
      {
        name: "Min. Withdrawble Amount",
        path: "/withdraw",
      },
      {
        name: "Paypal Account",
        path: "/paypal",
      },
      {
        name: "Credit Card Account",
        path: "/creditcards",
      },
    ],
    open: false,
    active: false,
  },
  {
    title: "Site Settings",
    icon: <AdjustmentsVerticalIcon className="w-5 h-5" />,
    links: [
      {
        name: "Questions",
        path: "/questions",
      },
      {
        name: "Contact Info",
        path: "/contact",
      },
      {
        name: "Privacy Policy",
        path: "/privacy",
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
        name: "User Credentials",
        path: "/credentails",
      },
      {
        name: "Roles",
        path: "/roles",
      },
      // {
      //   name: "Login",
      //   path: "/login",
      // },
      // {
      //   name: "Register",
      //   path: "/register",
      // },
    ],
    open: false,
    active: false,
  },
];
