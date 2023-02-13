"use client";

import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStateContext } from "../../../context/AppConext";
import useAccessToken from "../../../hooks/useAccessToken";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import { ISysUser } from "../../../typings";
import {
  createChatFn,
  getAllLastChatUsersFn,
  getAllUsersChatFn,
  IChat,
} from "../../api/chatApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSearch from "../../../components/FormSearch";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistance, subDays, parseISO } from "date-fns";
import useDebounce from "../../../hooks/useDebounce";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import FormUploader from "../../../components/FormUploader";

type sendMessage = {
  senderId: string;
  receiverId: string;
  text: string;
  fileUrl: string;
  message_type: string;
  time: Date;
};
const createMessageSchema = object({
  message: string().optional(),
  imgAttachment: z.instanceof(File).optional(),
  fileAttachment: z.instanceof(File).optional(),
});
export type ICreateMessage = TypeOf<typeof createMessageSchema>;

const page = () => {
  const [currentChat, setCurrentChat] = useState<ISysUser | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [chat, setChat] = useState<IChat[]>([]);
  const stateContext = useStateContext();
  const token = useAccessToken();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  const skt = stateContext.socketState.socket;
  const [fileUrl, setFileUrl] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data: items,
    status: lastStatus,
    isLoading,
    isSuccess,
    error: lastError,
  } = useInfiniteQuery(
    ["lastchat", debouncedSearchQuery],
    ({ pageParam = 1 }) =>
      getAllLastChatUsersFn(token, pageParam, debouncedSearchQuery),
    {
      retry: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      onError: (error) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  const lastchatRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: lastchatRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const setCurrentChatUser = (
    id: string,
    email: string,
    fullname: string,
    imgPath: string
  ): void => {
    const user: ISysUser = {
      id: id,
      email: email,
      fullname: fullname,
      imgPath: imgPath,
      is_active: true,
      phone: "0000",
    };
    stateContext.chatDispatch({
      type: "SET_Current_Chat",
      payload: user,
      setChat: true,
    });
  };

  const content = items?.pages.map((pg) => {
    return pg.map((chatuser, i) => {
      return (
        <a
          key={i}
          className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-primary focus:outline-none"
        >
          {chatuser.sender_id === stateContext.state.authUser?.id ? (
            <>
              <img
                className="object-cover w-10 h-10 rounded-full"
                src={chatuser.reciever_img ?? "/noImg.jpg"}
                alt="username"
              />
              <div
                className="w-full pb-2"
                onClick={() =>
                  setCurrentChatUser(
                    chatuser.receiver_id,
                    chatuser.reciever_email,
                    chatuser.reciever_name,
                    chatuser.reciever_img ?? ""
                  )
                }
              >
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold ">
                    {chatuser.reciever_name}
                  </span>
                  <span className="block ml-2 text-sm ">
                    {formatDistance(
                      parseISO(chatuser.createdAt.toString()),
                      subDays(new Date(), 0),
                      {
                        addSuffix: true,
                        includeSeconds: true,
                      }
                    )}
                  </span>
                </div>
                <span className="block ml-2 text-sm truncate">
                  {chatuser.message_type === "text"
                    ? chatuser.message
                    : chatuser.message_type === "image"
                    ? "view Image..."
                    : chatuser.message_type === "file"
                    ? "view document..."
                    : "Message Undefined"}
                </span>
              </div>
            </>
          ) : (
            <>
              <img
                className="object-cover w-10 h-10 rounded-full"
                src={chatuser.sender_img ?? "/noImg.jpg"}
                alt="username"
              />
              <div
                className="w-full pb-2"
                onClick={() =>
                  setCurrentChatUser(
                    chatuser.sender_id,
                    chatuser.sender_email,
                    chatuser.sender_name,
                    chatuser.sender_img ?? ""
                  )
                }
              >
                <div className="flex justify-between">
                  <span className="block ml-2 font-semibold ">
                    {chatuser.sender_name}
                  </span>
                  <span className="block ml-2 text-sm ">
                    {formatDistance(
                      parseISO(chatuser.createdAt.toString()),
                      subDays(new Date(), 0),
                      {
                        addSuffix: true,
                        includeSeconds: true,
                      }
                    )}
                  </span>
                </div>
                <span className="block ml-2 text-sm truncate">
                  {chatuser.message}
                </span>
              </div>
            </>
          )}
        </a>
      );
    });
  });

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
    if (currentChat !== null) {
      setCurrentChat(stateContext.chatState.currentChat);
    } else {
      setCurrentChat(stateContext.chatState.currentChat);
    }
    setChat([]);
  }, [stateContext.chatState.currentChat]);

  useUpdateEffect(() => {
    skt?.on("getMessage", (data: sendMessage) => {
      const recevedMsg: IChat = {
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        message: data.text,
        fileUrl: data.fileUrl,
        message_type: data.message_type,
        createdAt: data.time,
      };
      recevedMsg &&
        recevedMsg.receiver_id === stateContext.state.authUser?.email &&
        setChat((prev) => [...prev, recevedMsg]);
    });
  }, [skt]);

  const onSubmitHandler: SubmitHandler<ICreateMessage> = async (values) => {
    try {
      if (!currentChat) {
        toast.error("search or select user to start the chat", {
          position: "top-right",
        });
        return;
      }
      setLoadingMessage(true);

      const formData = new FormData();
      formData.append("receiver_id", currentChat?.id!);
      if (values.imgAttachment !== undefined) {
        formData.append("attachment", values.imgAttachment);
        formData.append("message", "image");
        formData.append("message_type", "image");
      } else if (values.fileAttachment !== undefined) {
        formData.append("attachment", values.fileAttachment);
        formData.append("message", "file");
        formData.append("message_type", "file");
      } else if (values.message !== undefined && values.message !== "") {
        formData.append("message", values.message);
        formData.append("message_type", "text");
      } else {
        toast.error("Please Insert a Text or Upload a File", {
          position: "top-right",
        });
        return;
      }
      const response = await createChatFn(token, formData);

      setLoadingMessage(false);
      skt?.emit("sendMessage", {
        senderId: stateContext.state.authUser?.email,
        receiverId: stateContext.chatState.currentChat?.email,
        text: response.message,
        fileUrl: response.fileUrl,
        message_type: response.message_type,
        time: response.createdAt,
      });
      if (chat) {
        setChat((prev) => [...prev, response]);
      } else {
        toast.error("search or select user to start the chat", {
          position: "top-right",
        });
      }
    } catch (error) {
      setLoadingMessage(false);
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    }
  };

  useUpdateEffect(() => {
    buttonRef.current?.click();
    // formRef.current?.submit();
  }, [fileUrl]);

  const {
    fetchPreviousPage, //function
    hasPreviousPage, // boolean
    isFetchingPreviousPage, // boolean
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
        });
      },
      onError: (error) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

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
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
          </div>
          <ul className="overflow-auto h-[calc(100vh_-_13.5rem)]">
            <h2 className="my-2 mb-2 ml-2 text-lg">Recent</h2>
            {isLoading && <p className="my-2 mb-2 ml-2 text-sm">Loading...</p>}
            <li>
              {isSuccess && content}
              <div
                ref={lastchatRef}
                className={`${!hasNextPage ? "hidden" : ""}`}
              >
                {isFetchingNextPage && (
                  <p className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                    Loading More...
                  </p>
                )}
              </div>
              {!hasNextPage && !isLoading && (
                <div className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                  No More Mesaages
                </div>
              )}
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
                <p className="text-center">select user from search</p>
              </ul>
            </div>

            <FormProvider {...methods}>
              <form noValidate onSubmit={methods.handleSubmit(onSubmitHandler)}>
                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                  <FormUploader
                    allowdTypes="image/*"
                    name="imgAttachment"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    }
                  />

                  <FormUploader
                    allowdTypes=".doc, .docx, .pdf, .xls, .xlsx"
                    name="fileAttachment"
                    icon={
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
                    }
                  />

                  <FormSearch label="message..." name="message" type="text" />

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
    return <p className="center">Internal Server Error</p>;

  if (lastError === "error")
    return <p className="center">Internal Server Error</p>;

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
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </div>
        </div>
        <ul className="overflow-auto h-[calc(100vh_-_13.5rem)]">
          <h2 className="my-2 mb-2 ml-2 text-lg">Recent</h2>
          {isLoading && <p className="my-2 mb-2 ml-2 text-sm">Loading...</p>}
          <li>
            {isSuccess && content}
            <div
              ref={lastchatRef}
              className={`${!hasNextPage ? "hidden" : ""}`}
            >
              {isFetchingNextPage && (
                <p className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                  Loading More...
                </p>
              )}
            </div>
            {!hasNextPage && !isLoading && (
              <div className="text-center bg-gray-50 p-2 rounded-md text-gray-400 text-sm mt-5">
                No More Mesaages
              </div>
            )}
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
                          : "bg-dark text-white dark:bg-darker"
                      }`}
                    >
                      <span className="block">
                        {uchat.message_type === "text" ? (
                          uchat.message
                        ) : uchat.message_type === "image" ? (
                          <div className="w-full p-0 flex justify-center">
                            <a
                              href={uchat.fileUrl}
                              target="_blank"
                              className="cursor-pointer"
                            >
                              <img
                                id="showImage"
                                className="max-w-lg w-40 items-center border"
                                src={uchat.fileUrl}
                                alt=""
                              />
                            </a>
                          </div>
                        ) : uchat.message_type === "file" ? (
                          <div>
                            <a
                              href={uchat.fileUrl}
                              target="_blank"
                              className="w-full p-2 flex justify-between cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                              <label className="underline cursor-pointer">
                                view document
                              </label>
                            </a>
                          </div>
                        ) : (
                          "Message Undefined"
                        )}
                      </span>
                      <span className="block text-xs">
                        {formatDistance(
                          parseISO(uchat.createdAt.toString()),
                          subDays(new Date(), 0),
                          {
                            addSuffix: true,
                            includeSeconds: true,
                          }
                        )}
                      </span>
                    </div>
                  </li>
                ))}

              <div ref={scrollRef} className="flex mt-5" />
            </ul>
          </div>

          <FormProvider {...methods}>
            <form noValidate onSubmit={methods.handleSubmit(onSubmitHandler)}>
              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <FormUploader
                  setFileUrl={setFileUrl}
                  allowdTypes="image/*"
                  name="imgAttachment"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  }
                />

                <FormUploader
                  setFileUrl={setFileUrl}
                  allowdTypes=".doc, .docx, .pdf, .xls, .xlsx"
                  name="fileAttachment"
                  icon={
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
                  }
                />

                <FormSearch label="message..." name="message" type="text" />
                <button type="submit" ref={buttonRef}>
                  {loadingMessage ? (
                    <svg
                      className="w-4 h-4 origin-center ml-1 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25 w-3 h-3 text-gray-500"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
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
