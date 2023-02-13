"use client";
import { createContext, useContext, useReducer } from "react";
import { senderNotification } from "../app/api/notificationApi";
import { ILoginResponse, ISysUser, IUser } from "../typings";
import { Socket, io } from "socket.io-client";

type State = {
  authUser: IUser | null;
};
type ChatState = {
  currentChat: ISysUser | null;
  getchat: boolean;
};
type TokenState = {
  token: ILoginResponse | null;
};
type NotificationState = {
  notification: senderNotification | null;
};
type SocketState = {
  socket: Socket | null;
};

type Action = {
  type: string;
  payload: IUser | null;
};
type ChatAction = {
  type: string;
  payload: ISysUser | null;
  setChat: boolean;
};

type TokenAction = {
  type: string;
  payload: ILoginResponse | null;
};
type NotificationAction = {
  payload: senderNotification | null;
};

type SocketAction = {
  payload: Socket | null;
};

type Dispatch = (action: Action) => void;
type ChatDispatch = (action: ChatAction) => void;
type DispatchToken = (action: TokenAction) => void;
type DispatchNotification = (action: NotificationAction) => void;
type DispatchSocket = (action: SocketAction) => void;

const initialState: State = {
  authUser: null,
};
const initialChatState: ChatState = {
  currentChat: null,
  getchat: false,
};

const initialTokenState: TokenState = {
  token: null,
};
const initialNotificationState: NotificationState = {
  notification: null,
};
const initialSocketState: SocketState = {
  // socket: io("http://194.195.87.30:89", {
  //   transports: ["websocket", "polling"],
  //   autoConnect: false,
  // }),
  // socket: io("http://194.195.87.30:89"),
  socket: io("http://localhost:3002"),
};

type StateContextProviderProps = { children: React.ReactNode };

const StateContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
      tokenState: TokenState;
      tokenDispatch: DispatchToken;
      notificationState: NotificationState;
      notificationDispatch: DispatchNotification;
      chatState: ChatState;
      chatDispatch: ChatDispatch;
      socketState: SocketState;
      socketDispatch: DispatchSocket;
    }
  | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        ...state,
        authUser: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};
const stateTokenReducer = (state: TokenState, action: TokenAction) => {
  switch (action.type) {
    case "SET_Token": {
      return {
        ...state,
        token: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};
const stateNotificationReducer = (
  state: NotificationState,
  action: NotificationAction
) => {
  return {
    ...state,
    notification: action.payload,
  };
};
const stateSocketReducer = (state: SocketState, action: SocketAction) => {
  return {
    ...state,
    socket: action.payload,
  };
};
const CurrenChatReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case "SET_Current_Chat": {
      return {
        ...state,
        currentChat: action.payload,
        getchat: action.setChat,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [tokenState, tokenDispatch] = useReducer(
    stateTokenReducer,
    initialTokenState
  );
  const [notificationState, notificationDispatch] = useReducer(
    stateNotificationReducer,
    initialNotificationState
  );
  const [socketState, socketDispatch] = useReducer(
    stateSocketReducer,
    initialSocketState
  );
  const [chatState, chatDispatch] = useReducer(
    CurrenChatReducer,
    initialChatState
  );

  const value = {
    state,
    dispatch,
    tokenState,
    tokenDispatch,
    notificationState,
    notificationDispatch,
    chatState,
    chatDispatch,
    socketState,
    socketDispatch,
  };
  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateContextProvider, useStateContext };

const AppContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});
export default AppContext;
