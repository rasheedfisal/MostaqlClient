"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAccessToken from "../../../../hooks/useAccessToken";
import { updateReadNotification } from "../../../api/notificationApi";
import { useStateContext } from "../../../../context/AppConext";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";
import { useRouter } from "next/navigation";

const page = () => {
  const stateContext = useStateContext();
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { isLoading, mutate: updateRead } = useMutation(
    ({ id, accessToken }: { id: string; accessToken: string }) =>
      updateReadNotification({ id, accessToken }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  //   if (isLoading) {
  //     return <p>Loading...</p>;
  //   }

  useUpdateEffect(() => {
    if (!stateContext.notificationState.notification?.id) router.push("/home");
  }, []);
  useUpdateEffect(() => {
    if (stateContext.notificationState.notification?.id)
      updateRead({
        id: stateContext.notificationState.notification?.id,
        accessToken: token,
      });
  }, [stateContext.notificationState]);

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">View Notification</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="grid grid-cols-1">
            <input
              className="px-4 py-2 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
              name="title"
              type="text"
              autoComplete="off"
              value={stateContext.notificationState.notification?.title}
              readOnly
            />
          </div>
          <div className="grid grid-cols-1">
            <textarea
              className="px-4 py-2 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
              name="description"
              autoComplete="off"
              rows={5}
              value={stateContext.notificationState.notification?.description}
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
