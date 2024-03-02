"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAccessToken from "../../../../hooks/useAccessToken";
import SubmitButton from "../../../../components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "../../../../components/FormInput";
import Link from "next/link";
import { getRateFn, updateRateFn } from "../../../api/commissionrateApi";
import FormCheckbox from "../../../../components/FormCheckbox";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";

type PageProps = {
  params: {
    rateId: string;
  };
};

const updateRateSchema = object({
  ratepercent: z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  iscurrent: z.boolean(),
}).partial();

export type IUpdateRate = TypeOf<typeof updateRateSchema>;

const page = ({ params: { rateId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isPriceLoading, data, isSuccess, error } = useQuery(
    {
      queryKey: ["getrate", rateId],
      queryFn: () => getRateFn(rateId, token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateRate } = useMutation(
    {
      mutationFn: ({
        id,
        rate,
        accessToken,
      }: {
        id: string;
        rate: IUpdateRate;
        accessToken: string;
      }) => updateRateFn({ id, rate, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["rates"]});
        toast.success("Rate updated successfully");
      },
      onError: (error) => {
        toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdateRate>({
    resolver: zodResolver(updateRateSchema),
  });

  useUpdateEffect(() => {
    if (isSuccess) {
      methods.reset({
            ratepercent: data.ratepercent.toString(),
            iscurrent: data.iscurrent,
          });
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])

 

  const onSubmitHandler: SubmitHandler<IUpdateRate> = (values) => {
    updateRate({ id: rateId, rate: values, accessToken: token });
  };

   if (isPriceLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Rate</h1>
        <Link
          href="/rate"
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
                <FormInput label="Rate" type="text" name="ratepercent" />
              </div>
              <div className="grid grid-cols-1">
                <FormCheckbox label="Current" name="iscurrent" />
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
