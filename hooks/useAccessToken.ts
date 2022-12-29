import { useStateContext } from "../context/AppConext";

const useAccessToken = () => {
  const stateContext = useStateContext();
  const token = (): string => {
    return stateContext.tokenState.token?.token!;
  };

  const access_token = token();
  return access_token;
};

export default useAccessToken;
