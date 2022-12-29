import { useStateContext } from "../context/AppConext";
import { refreshAccessTokenFn } from "../app/api/axios";
import { getMeFn } from "../app/api/authApi";

const useRefreshToken = () => {
  const stateContext = useStateContext();
  const refresh = async () => {
    try {
      const response = await refreshAccessTokenFn();

      stateContext.tokenDispatch({ type: "SET_Token", payload: response });
      const getCurrentUser = await getMeFn(response?.token);
      stateContext.dispatch({ type: "SET_USER", payload: getCurrentUser });

      return response?.token;
    } catch (error) {}
  };

  return refresh;
};

export default useRefreshToken;
