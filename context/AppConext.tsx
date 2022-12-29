"use client";
import { createContext, useContext, useReducer } from "react";
import { ILoginResponse, IToken, IUser } from "../typings";

type State = {
  authUser: IUser | null;
};
type TokenState = {
  token: ILoginResponse | null;
};
type Action = {
  type: string;
  payload: IUser | null;
};

type TokenAction = {
  type: string;
  payload: ILoginResponse | null;
};

type Dispatch = (action: Action) => void;
type DispatchToken = (action: TokenAction) => void;

const initialState: State = {
  authUser: null,
};

const initialTokenState: TokenState = {
  token: null,
};

type StateContextProviderProps = { children: React.ReactNode };

const StateContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
      tokenState: TokenState;
      tokenDispatch: DispatchToken;
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

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [tokenState, tokenDispatch] = useReducer(
    stateTokenReducer,
    initialTokenState
  );
  const value = { state, dispatch, tokenState, tokenDispatch };
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
