import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getAllUsersChatFn, IChat, IChatRequest } from "../app/api/chatApi";

type useFetchProps = {
  token: string;
  page: number;
  chat: IChatRequest;
};

function useFetchChat({ token, chat, page }: useFetchProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState<IChat[]>([]);

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      const res = await getAllUsersChatFn(token, chat, page, 10);
      await setList((prev) => [...prev, ...res]);
      setLoading(false);
    } catch (err) {
      setError((err as any).response?.data?.msg?.message);
    }
  }, [page]);

  useEffect(() => {
    sendQuery();
  }, [sendQuery, page]);

  return { loading, error, list };
}

export default useFetchChat;
