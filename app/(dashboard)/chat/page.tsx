"use client";

import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStateContext } from "../../../context/AppConext";
import useAccessToken from "../../../hooks/useAccessToken";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import { ISysUser } from "../../../typings";
import { createChatFn, getAllUsersChatFn, IChat } from "../../api/chatApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSearch from "../../../components/FormSearch";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import io, { Socket } from "socket.io-client";

type sendMessage = {
  sender_id: string;
  receiver_id: string;
  text: string;
};
const createMessageSchema = object({
  message: string().min(1, "message is required"),
});
export type ICreateMessage = TypeOf<typeof createMessageSchema>;
const page = () => {
  const [currentChat, setCurrentChat] = useState<ISysUser | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [pageNo, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  const [sendMessage, setSendMessage] = useState<sendMessage>();
  const [chat, setChat] = useState<IChat[]>([]);
  // const [arrivalMessage, setArrivalMessage] = useState<IChat>();
  const stateContext = useStateContext();
  const token = useAccessToken();
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef<any>();

  const methods = useForm<ICreateMessage>({
    resolver: zodResolver(createMessageSchema),
  });

  const {
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  useUpdateEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chat]);

  useUpdateEffect(() => {
    // socket.current = io("http://194.195.87.30:89", {
    //   transports: ["websocket", "polling"],
    //   autoConnect: false,
    // }); //http://localhost:3002
    socket.current = io("http://194.195.87.30:89"); //http://localhost:3002
    socket.current.on("getMessage", (data: any) => {
      // setSendMessage({
      //   sender_id: data.sender_id,
      //   receiver_id: data.receiver_id,
      //   text: Date.now().toString(),
      // });
      console.log(data);
    });
    console.log(socket.current);
  }, []);
  useUpdateEffect(() => {
    if (currentChat !== null) {
      setCurrentChat(stateContext.chatState.currentChat);
    } else {
      setCurrentChat(stateContext.chatState.currentChat);
    }
    socket.current?.emit("addUser", stateContext.chatState.currentChat?.email);
  }, [stateContext.chatState.currentChat]);

  const onSubmitHandler: SubmitHandler<ICreateMessage> = async (values) => {
    try {
      if (!currentChat) {
        toast.error("search or select user to start the chat", {
          position: "top-right",
        });
        return;
      }
      const response = await createChatFn(token, {
        receiver_id: currentChat?.id!,
        message: values.message,
      });
      if (chat) {
        socket.current?.emit("sendMessage", {
          senderId: stateContext.state.authUser?.email,
          receiverId: currentChat?.email!,
          text: values.message,
        });
        console.log("send message");
        setChat((prev) => [...prev, response]);
      } else {
        toast.error("search or select user to start the chat", {
          position: "top-right",
        });
      }
    } catch (error) {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    }
  };

  const {
    fetchPreviousPage, //function
    hasPreviousPage, // boolean
    isFetchingPreviousPage, // boolean
    data,
    status,
    error,
  } = useInfiniteQuery(
    ["userchat", currentChat?.id],
    ({ pageParam = 1 }) =>
      getAllUsersChatFn(
        token,
        { receiver_id: currentChat?.id! },
        pageParam,
        10
      ),
    {
      retry: 1,
      enabled: stateContext.chatState.getchat,
      getPreviousPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      onSuccess: (data) => {
        data?.pages.map((pg) => {
          setChat((prev) => Array.from(new Set([...prev, ...pg])));
          //Array.from(new Set([...prev, ...pg]))
          // .sort(
          //   (a, b) =>
          //     parseISO(a.createdAt.toString()).getTime() -
          //     parseISO(b.createdAt.toString()).getTime()
          // )
        });
      },
      onError: (error) => {
        if ((error as any).response?.data?.msg?.message) {
          // toast.error((error as any).response?.data?.msg?.message, {
          //   position: "top-right",
          // });
          console.log((error as any).response?.data?.msg?.message);
        }
      },
    }
  );

  // const intObserver = useRef<IntersectionObserver | null>(null);
  // const lastPostRef = useCallback(
  //   (node: HTMLLIElement) => {
  //     if (isFetchingNextPage) return;

  //     if (intObserver.current) intObserver.current.disconnect();

  //     intObserver.current = new IntersectionObserver((chat) => {
  //       if (chat[0].isIntersecting && hasNextPage) {
  //         console.log("We are near the last chat!");
  //         fetchNextPage();
  //       }
  //     });

  //     if (node) intObserver.current.observe(node);
  //   },
  //   [isFetchingNextPage, fetchNextPage, hasNextPage]
  // );

  if (currentChat === null) {
    return (
      <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
        <div className="border-r hidden lg:block border-gray-300 lg:col-span-1">
          <div className="mx-3 my-3">
            <div className="relative text-gray-600">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-300"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="search"
                className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                name="search"
                placeholder="Search"
                required
              />
            </div>
          </div>
          <ul className="overflow-auto h-[calc(100vh_-_13.5rem)]">
            <h2 className="my-2 mb-2 ml-2 text-lg">Chats</h2>
            <li>
              <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
                  alt="username"
                />
                <div className="w-full pb-2">
                  <div className="flex justify-between">
                    <span className="block ml-2 font-semibold ">Jhon Don</span>
                    <span className="block ml-2 text-sm ">25 minutes</span>
                  </div>
                  <span className="block ml-2 text-sm ">bye</span>
                </div>
              </a>
              <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out  border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2016/06/15/15/25/loudspeaker-1459128__340.png"
                  alt="username"
                />
                <div className="w-full pb-2">
                  <div className="flex justify-between">
                    <span className="block ml-2 font-semibold ">Same</span>
                    <span className="block ml-2 text-sm ">50 minutes</span>
                  </div>
                  <span className="block ml-2 text-sm ">Good night</span>
                </div>
              </a>
              <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                  alt="username"
                />
                <div className="w-full pb-2">
                  <div className="flex justify-between">
                    <span className="block ml-2 font-semibold ">Emma</span>
                    <span className="block ml-2 text-sm ">6 hour</span>
                  </div>
                  <span className="block ml-2 text-sm ">Good Morning</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2 border-r">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="noImg.jpg"
                alt="avatar"
                loading="lazy"
              />
              <span className="block ml-2 font-bold text-gray-600">
                search or select user to start the chat
              </span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div className="relative w-full p-6 overflow-y-auto h-[calc(100vh_-_13.5rem)]">
              <ul className="space-y-2">
                {/* {chat?.reverse().map((uchat, i) => (
              <li
                key={i}
                className={
                  uchat.receiver_id === currentChat?.id
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={`relative max-w-xl px-4 py-2 rounded shadow ${
                    uchat.receiver_id === currentChat?.id
                      ? "bg-primary-lighter"
                      : "bg-info-lighter"
                  }`}
                >
                  <span className="block">{uchat.message}</span>
                </div>
              </li>
            ))} */}
                <p className="text-center">select user from search</p>
                {/* <div ref={scrollRef} /> */}
              </ul>
            </div>

            {/* <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button> */}

            {/* <input
            type="text"
            placeholder="Message"
            className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
            name="message"
            required
          /> */}
            {/* <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button> */}
            <FormProvider {...methods}>
              <form noValidate onSubmit={methods.handleSubmit(onSubmitHandler)}>
                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                  <FormSearch label="Search" name="message" type="search" />
                  <button type="submit">
                    <svg
                      className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error")
    return (
      <p className="center">
        Error: {(error as any).response?.data?.msg?.message}
      </p>
    );

  // const content = data?.pages.map((pg) => {
  //   return pg
  //     .sort(
  //       (a, b) =>
  //         parseISO(a.createdAt.toString()).getTime() -
  //         parseISO(b.createdAt.toString()).getTime()
  //     )
  //     // .map((uchat, i) => {
  //     //   // if (pg.length === i + 1) {
  //     //   //   return (
  //     //   //     <li
  //     //   //       key={i}
  //     //   //       ref={scrollRef}
  //     //   //       className={
  //     //   //         uchat.receiver_id === currentChat?.id
  //     //   //           ? "flex justify-end"
  //     //   //           : "flex justify-start"
  //     //   //       }
  //     //   //     >
  //     //   //       <div
  //     //   //         className={`relative max-w-xl px-4 py-2 rounded shadow ${
  //     //   //           uchat.receiver_id === currentChat?.id
  //     //   //             ? "bg-primary-lighter"
  //     //   //             : "bg-info-lighter"
  //     //   //         }`}
  //     //   //       >
  //     //   //         <span className="block">{uchat.message}</span>
  //     //   //       </div>
  //     //   //     </li>
  //     //   //   );
  //     //   // } else if (i === 0) {
  //     //   // if (i === 0) {
  //     //   //   return (
  //     //   //     <li
  //     //   //       key={i}
  //     //   //       // ref={lastPostRef}
  //     //   //       className={
  //     //   //         uchat.receiver_id === currentChat?.id
  //     //   //           ? "flex justify-end"
  //     //   //           : "flex justify-start"
  //     //   //       }
  //     //   //     >
  //     //   //       <div
  //     //   //         className={`relative max-w-xl px-4 py-2 rounded shadow ${
  //     //   //           uchat.receiver_id === currentChat?.id
  //     //   //             ? "bg-primary-lighter"
  //     //   //             : "bg-info-lighter"
  //     //   //         }`}
  //     //   //       >
  //     //   //         <span className="block">{uchat.message}</span>
  //     //   //       </div>
  //     //   //     </li>
  //     //   //   );
  //     //   // }
  //     //   return (
  //     //     <li
  //     //       key={i}
  //     //       className={
  //     //         uchat.receiver_id === currentChat?.id
  //     //           ? "flex justify-end"
  //     //           : "flex justify-start"
  //     //       }
  //     //     >
  //     //       <div
  //     //         className={`relative max-w-xl px-4 py-2 rounded shadow ${
  //     //           uchat.receiver_id === currentChat?.id
  //     //             ? "bg-primary-lighter"
  //     //             : "bg-info-lighter"
  //     //         }`}
  //     //       >
  //     //         <span className="block">{uchat.message}</span>
  //     //       </div>
  //     //     </li>
  //     //   );
  //     // });
  // });

  // const content = data?.pages.map((pg) => {
  //   return pg
  //     .sort(
  //       (a, b) =>
  //         parseISO(a.createdAt.toString()).getTime() -
  //         parseISO(b.createdAt.toString()).getTime()
  //     )
  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  return (
    // <div className="container mx-auto">
    <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
      <div className="border-r hidden lg:block border-gray-300 lg:col-span-1">
        <div className="mx-3 my-3">
          <div className="relative text-gray-600">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-gray-300"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
              name="search"
              placeholder="Search"
              required
            />
          </div>
        </div>
        <ul className="overflow-auto h-[calc(100vh_-_13.5rem)]">
          <h2 className="my-2 mb-2 ml-2 text-lg">Chats</h2>
          <li>
            <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
                alt="username"
              />
              <div className="w-full pb-2">
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold ">Jhon Don</span>
                  <span className="block ml-2 text-sm ">25 minutes</span>
                </div>
                <span className="block ml-2 text-sm ">bye</span>
              </div>
            </a>
            <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out  border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2016/06/15/15/25/loudspeaker-1459128__340.png"
                alt="username"
              />
              <div className="w-full pb-2">
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold ">Same</span>
                  <span className="block ml-2 text-sm ">50 minutes</span>
                </div>
                <span className="block ml-2 text-sm ">Good night</span>
              </div>
            </a>
            <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                alt="username"
              />
              <div className="w-full pb-2">
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold ">Emma</span>
                  <span className="block ml-2 text-sm ">6 hour</span>
                </div>
                <span className="block ml-2 text-sm ">Good Morning</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div className="lg:col-span-2 border-r">
        <div className="w-full">
          <div className="relative flex items-center p-3 border-b border-gray-300">
            <img
              className="object-cover w-10 h-10 rounded-full"
              src={currentChat?.imgPath ?? "noImg.jpg"}
              alt="avatar"
              loading="lazy"
            />
            <span className="block ml-2 font-bold text-gray-600">
              {currentChat
                ? currentChat?.fullname
                : "search or select user to start the chat"}
            </span>
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
          </div>
          <div className="relative w-full p-6 overflow-y-auto h-[calc(100vh_-_13.5rem)]">
            <ul className="space-y-2">
              {/* {chat?.reverse().map((uchat, i) => (
                <li
                  key={i}
                  className={
                    uchat.receiver_id === currentChat?.id
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={`relative max-w-xl px-4 py-2 rounded shadow ${
                      uchat.receiver_id === currentChat?.id
                        ? "bg-primary-lighter"
                        : "bg-info-lighter"
                    }`}
                  >
                    <span className="block">{uchat.message}</span>
                  </div>
                </li>
              ))} */}
              <div>
                <button
                  className="bg-warning-lighter p-2 rounded-md"
                  onClick={() => fetchPreviousPage()}
                  disabled={!hasPreviousPage || isFetchingPreviousPage}
                >
                  {isFetchingPreviousPage
                    ? "Loading more..."
                    : hasPreviousPage
                    ? "Load Older Messages"
                    : "Nothing more to load"}
                </button>
              </div>
              {/* {isFetchingNextPage && (
                <p className="text-center">Loading More Posts...</p>
              )} */}
              {Array.from(new Set(chat))
                .sort(
                  (a, b) =>
                    parseISO(a.createdAt.toString()).getTime() -
                    parseISO(b.createdAt.toString()).getTime()
                )
                .map((uchat, i) => (
                  <li
                    key={i}
                    className={
                      uchat.receiver_id === currentChat?.id
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={`relative max-w-xl px-4 py-2 rounded shadow ${
                        uchat.receiver_id === currentChat?.id
                          ? "bg-primary-lighter"
                          : "bg-info-lighter"
                      }`}
                    >
                      <span className="block">{uchat.message}</span>
                    </div>
                  </li>
                ))}

              <div ref={scrollRef} />
            </ul>
          </div>

          {/* <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button> */}

          {/* <input
              type="text"
              placeholder="Message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              required
            /> */}
          {/* <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button> */}
          <FormProvider {...methods}>
            <form noValidate onSubmit={methods.handleSubmit(onSubmitHandler)}>
              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <FormSearch label="Search" name="message" type="search" />
                <button type="submit">
                  <svg
                    className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
    //</div>
  );
};

export default page;
