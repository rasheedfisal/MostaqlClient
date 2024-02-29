"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAccessToken from "../../../hooks/useAccessToken";
import SubmitButton from "../../../components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import FormInput from "../../../components/FormInput";
import { getPaypalFn, updatePaypalFn } from "../../api/siteInfoApi";

const updsertPaypalSchema = object({
  email: string().min(1, "Email is required").email(),
}).partial();

export type IUpdsertPaypal = TypeOf<typeof updsertPaypalSchema>;

const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isItemsLoading, isSuccess, error, data } = useQuery(
    {
      queryKey: ["getPaypal"],
      queryFn: () => getPaypalFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateItem } = useMutation(
    
    {
      mutationFn: ({ data, accessToken }: { data: IUpdsertPaypal; accessToken: string }) =>
      updatePaypalFn({ data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["getPaypal"]});
        toast.success("Paypal Account updated successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdsertPaypal>({
    resolver: zodResolver(updsertPaypalSchema),
  });

  if (isSuccess) {
    methods.reset({
            email: data.email,
          });
  }

  if (error !== null) {
    toast.error(error.message, {position: "top-right"})
  }

  if (isItemsLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdsertPaypal> = (values) => {
    updateItem({ data: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Paypal</h1>
        {/* <Link
          href="/roles"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link> */}
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
                <FormInput label="Email" type="email" name="email" />
              </div>
              <div className="flex">
                <SubmitButton
                  title="Submit"
                  clicked={isPending}
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
