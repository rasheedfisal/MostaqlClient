import { useRouter } from "next/navigation";
import React, { MouseEventHandler, useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { ISysUser } from "../typings";
import { useStateContext } from "../context/AppConext";

type StatusProps = {
  user: ISysUser;
  color: string;
  who: string;
};

const ChatButton = ({ user, color, who }: StatusProps) => {
  const [chatInitial, setChatInitial] = useState(false);
  const router = useRouter();
  const stateContext = useStateContext();
  const handleChat = () => {
    setChatInitial(true);
    setCurrentChatUser(user);
    setTimeout(() => {
      setChatInitial(false);
      router.push("/chat");
    }, 3000);
  };

  const setCurrentChatUser = (user: ISysUser): void => {
    stateContext.chatDispatch({
      type: "SET_Current_Chat",
      payload: user,
      setChat: true,
    });
  };

  return (
    <div
      onClick={handleChat}
      className={`bg-${color}-600 hover:bg-${color}-700 flex justify-between items-center text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer`}
    >
      <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
      {chatInitial ? "wait..." : who}
    </div>
  );
};

export default ChatButton;
