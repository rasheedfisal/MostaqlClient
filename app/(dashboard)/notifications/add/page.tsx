"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "../../../../components/FormInput";
import SubmitButton from "../../../../components/SubmitButton";
import useAccessToken from "../../../../hooks/useAccessToken";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";
import { createNotitifcationFn } from "../../../api/notificationApi";
import FormRadioButton from "../../../../components/FormRadioButton";
import FormTextArea from "../../../../components/FormTextArea";
import { useStateContext } from "../../../../context/AppConext";

const createNotifySchema = object({
  title: string().min(1, "Title is required"),
  description: string().min(1, "Description is required"),
  target: string().min(1),
  // target2: z.boolean(),
  // target3: z.boolean(),
  // target4: z.boolean(),
});

export type ICreateNotify = TypeOf<typeof createNotifySchema>;

const page = () => {
  const token = useAccessToken();
  const stateContext = useStateContext();
  const queryClient = useQueryClient();
  const { isLoading, mutate: createNotify } = useMutation(
    (notify: ICreateNotify) =>
      createNotitifcationFn({ notify, accessToken: token }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["senderNotification"]);
        toast.success("Notification created successfully");
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

  const methods = useForm<ICreateNotify>({
    resolver: zodResolver(createNotifySchema),
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

  const onSubmitHandler: SubmitHandler<ICreateNotify> = (values) => {
    if (
      values.target !== "engineer" &&
      values.target !== "owner" &&
      values.target !== "all"
    ) {
      if (stateContext.chatState.currentChat?.id === null) {
        toast.error("Please Select User from Search Bar");
      } else {
        createNotify({
          title: values.title,
          description: values.description,
          target: stateContext.chatState.currentChat?.id!,
        });
      }
    } else {
      createNotify(values);
    }
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Send Notification</h1>
        <Link
          href="/notifications"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormInput label="Title" type="text" name="title" />
              </div>
              <div className="grid grid-cols-1">
                <FormTextArea label="Description" rows={5} name="description" />
              </div>

              <div className="grid grid-cols-1">
                <FormRadioButton label="All" name="target" value="all" />
              </div>
              <div className="grid grid-cols-1">
                <FormRadioButton
                  label="All Engineers"
                  name="target"
                  value="engineer"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormRadioButton
                  label="All Business Owners"
                  name="target"
                  value="owner"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormRadioButton
                  label="Individuals (select User from search befor Sending)"
                  name="target"
                  value="user"
                />
              </div>
              <div className="flex">
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default page;
