"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/AppConext";

import useRefreshToken from "../../hooks/useRefreshToken";

type Props = {
  children: React.ReactNode;
};
const Persist = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const stateContext = useStateContext();
  const token = stateContext.tokenState.token;

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    !token?.token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : children}</>;
};

export default Persist;
