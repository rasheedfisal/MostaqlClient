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
import { getWithdrawbleFn, updateWithdrawbleFn } from "../../api/siteInfoApi";
import useUpdateEffect from "../../../hooks/useUpdateEffect";

const updsertWithdrawSchema = object({
  amount: string()
    .min(1, "Amount is required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
}).partial();

export type IUpdsertWithdraw = TypeOf<typeof updsertWithdrawSchema>;

const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isItemsLoading, data, isSuccess, error } = useQuery(
    {
      queryKey: ["getWithdraw"],
      queryFn: () => getWithdrawbleFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateItem } = useMutation(
    {
      mutationFn: ({ data, accessToken }: { data: IUpdsertWithdraw; accessToken: string }) =>
        updateWithdrawbleFn({ data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["getWithdraw"]});
        toast.success("Minimum Withdrawable updated successfully");
      },
      onError: (error) => {
        toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdsertWithdraw>({
    resolver: zodResolver(updsertWithdrawSchema),
  });

  
  useUpdateEffect(() => {
    if (isSuccess) {
      methods.reset({
            amount: data.amount.toString(),
          });
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])


  const onSubmitHandler: SubmitHandler<IUpdsertWithdraw> = (values) => {
    updateItem({ data: values, accessToken: token });
  };

  if (isItemsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Minimum Withdrawable Amount</h1>
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
                <FormInput label="Amount" type="text" name="amount" />
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
